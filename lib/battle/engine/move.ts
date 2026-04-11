import { calculateDamage } from "../damage"
import { BattleEffect, BattleEffectTarget, BattlePokemon, BattleSide, BattleState } from "../types"
import { hasAvailablePokemon, getActivePokemon, isPokemonFainted } from "./pokemon"
import {
  applyStatChanges,
  applyStatusEffect,
  asBattleStatus,
  resolveEffectTargets,
  shouldApplyChance,
} from "./effects"

function applyMoveEffects(
  attacker: BattlePokemon,
  defender: BattlePokemon,
  state: BattleState,
  attackerSide: BattleSide,
  defenderSide: BattleSide,
  move: BattlePokemon["moves"][number],
  damageDealt: number,
  events: string[],
) {
  const effects = getMoveEffects(move)

  for (const effect of effects) {
    if (!shouldApplyChance(effect.chance)) continue

    const targets = resolveEffectTargets(effect.target, attacker, defender)

    if (effect.code === "status_apply") {
      const status = asBattleStatus(effect.data?.status)
      if (!status) continue

      for (const target of targets) {
        applyStatusEffect(target, status, events)
      }
      continue
    }

    if (effect.code === "flinch") {
      for (const target of targets) {
        if (isPokemonFainted(target)) continue
        target.flinched = true
        events.push(`${target.name} flinched!`)
      }
      continue
    }

    if (effect.code === "heal_self") {
      const ratio = typeof effect.data?.ratio === "number" ? effect.data.ratio : 0.5
      const healAmount = Math.max(0, Math.floor(attacker.maxHp * ratio))

      if (healAmount <= 0) continue

      const previousHp = attacker.currentHp
      attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + healAmount)
      const recovered = attacker.currentHp - previousHp

      if (recovered > 0) {
        events.push(`${attacker.name} restored ${recovered} HP.`)
      }
      continue
    }

    if (effect.code === "drain") {
      if (damageDealt <= 0) continue

      const ratio = typeof effect.data?.ratio === "number" ? effect.data.ratio : 0.5
      const drainAmount = Math.max(1, Math.floor(damageDealt * ratio))
      const previousHp = attacker.currentHp
      attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + drainAmount)
      const recovered = attacker.currentHp - previousHp

      if (recovered > 0) {
        events.push(`${attacker.name} drained ${recovered} HP.`)
      }
      continue
    }

    if (effect.code === "recoil") {
      if (damageDealt <= 0) continue

      const ratio = typeof effect.data?.ratio === "number" ? effect.data.ratio : 0.25
      const recoilAmount = Math.max(1, Math.floor(damageDealt * ratio))
      attacker.currentHp = Math.max(0, attacker.currentHp - recoilAmount)
      events.push(`${attacker.name} was hurt by recoil (${recoilAmount} HP).`)

      if (attacker.currentHp === 0) {
        attacker.fainted = true
        if (hasAvailablePokemon(state, attackerSide)) {
          state.pendingForcedSwitchSide = attackerSide
        }
        events.push(`${attacker.name} has fainted!`)
      }
      continue
    }

    if (effect.code === "stat_changes") {
      const rawChanges = effect.data?.changes
      if (!Array.isArray(rawChanges)) continue

      for (const target of targets) {
        const targetChanges = rawChanges.filter((change) => {
          if (!change || typeof change !== "object") return false
          const typed = change as Record<string, unknown>
          const changeTarget = typed.target

          if (changeTarget === "both") return true
          if (changeTarget === "self") return target === attacker
          if (changeTarget === "target") return target === defender

          return true
        }) as Array<Record<string, unknown>>

        if (targetChanges.length === 0) continue
        applyStatChanges(target, targetChanges, events)
      }
    }
  }
}

export function getMoveEffects(move: BattlePokemon["moves"][number]): BattleEffect[] {
  if (move.effectList?.length) {
    return move.effectList
  }

  if (!move.effectCode) return []

  return [
    {
      code: move.effectCode,
      chance: move.effectChance ?? null,
      target: (move.effectTarget as BattleEffectTarget | undefined) ?? null,
      data:
        move.effectData && typeof move.effectData === "object" && !Array.isArray(move.effectData)
          ? (move.effectData as Record<string, unknown>)
          : null,
    },
  ]
}

export function applyAttack(
  state: BattleState,
  side: BattleSide,
  moveIndex: number,
  events: string[],
) {
  const attacker = getActivePokemon(state, side)
  const defenderSide: BattleSide = side === "player" ? "ai" : "player"
  const defender = getActivePokemon(state, defenderSide)
  const move = attacker.moves[moveIndex]

  if (!move) {
    events.push(`${attacker.name} has no move in that slot.`)
    return
  }

  if (move.remainingPP != null) {
    if (move.remainingPP <= 0) {
      events.push(`${attacker.name} has no PP left for ${move.name}.`)
      return
    }

    move.remainingPP = Math.max(0, move.remainingPP - 1)
  }

  const result = calculateDamage(attacker, defender, move)

  if (!result.hit) {
    events.push(`${attacker.name} used ${move.name}, but it missed!`)
    return
  }

  defender.currentHp = Math.max(0, defender.currentHp - result.damage)
  if (defender.currentHp === 0) {
    defender.fainted = true

    if (hasAvailablePokemon(state, defenderSide)) {
      state.pendingForcedSwitchSide = defenderSide
    }
  }

  events.push(`${attacker.name} used ${move.name} for ${result.damage} damage.`)

  if (result.wasCritical) {
    events.push("A critical hit!")
  }

  if (result.typeMultiplier > 1) {
    events.push("It's super effective!")
  }

  if (result.typeMultiplier > 0 && result.typeMultiplier < 1) {
    events.push("It's not very effective...")
  }

  if (result.typeMultiplier === 0) {
    events.push("It had no effect.")
  }

  if (defender.fainted) {
    events.push(`${defender.name} has fainted!`)
  }

  applyMoveEffects(attacker, defender, state, side, defenderSide, move, result.damage, events)
}