import { BattleEffectTarget, BattlePokemon, BattleStatus } from "../types"
import { isPokemonFainted } from "./pokemon"

const MIN_STAGE = -6
const MAX_STAGE = 6

export function randomPercentRoll() {
  return Math.floor(Math.random() * 100) + 1
}

export function shouldApplyChance(chance: number | null | undefined) {
  if (chance == null) return true
  if (chance <= 0) return false
  if (chance >= 100) return true

  return randomPercentRoll() <= chance
}

export function getStageMultiplier(stage: number) {
  if (stage >= 0) {
    return (2 + stage) / 2
  }

  return 2 / (2 - stage)
}

export function asBattleStatus(value: unknown): BattleStatus | null {
  if (value === "burn" || value === "poison" || value === "badly_poison") return value
  if (value === "paralysis" || value === "sleep" || value === "freeze") return value
  return null
}

export function applyStatChanges(
  target: BattlePokemon,
  changes: Array<Record<string, unknown>>,
  events: string[],
) {
  if (isPokemonFainted(target)) return

  if (!target.statStages) {
    target.statStages = {
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
      accuracy: 0,
      evasion: 0,
    }
  }

  for (const change of changes) {
    const stat = change.stat
    const direction = change.direction
    const stages = change.stages

    if (
      typeof stat !== "string" ||
      typeof direction !== "string" ||
      typeof stages !== "number" ||
      !(stat in target.statStages)
    ) {
      continue
    }

    const signedStages = direction === "down" ? -Math.abs(stages) : Math.abs(stages)
    const current = target.statStages[stat as keyof NonNullable<typeof target.statStages>]
    const next = Math.max(MIN_STAGE, Math.min(MAX_STAGE, current + signedStages))

    target.statStages[stat as keyof NonNullable<typeof target.statStages>] = next

    if (next === current) continue

    const verb = signedStages > 0 ? "rose" : "fell"
    if (stat === "specialAttack") {
      events.push(`${target.name}'s special attack ${verb}!`)
    }
    else if (stat === "specialDefense") {
      events.push(`${target.name}'s special defense ${verb}!`)
    }
    else {
      events.push(`${target.name}'s ${stat} ${verb}!`)
    }
  }
}

export function applyStatusEffect(target: BattlePokemon, status: BattleStatus, events: string[]) {
  if (isPokemonFainted(target)) return

  if (target.status) {
    if (target.status === "badly_poison") {
      events.push(`${target.name} is already badly poisoned.`)
    }
    else {
      events.push(`${target.name} is already affected by ${target.status}.`)
    }
    return
  }

  target.status = status
  if (status === "badly_poison") {
    events.push(`${target.name} is now badly poisoned!`)
  }
  else {
    events.push(`${target.name} is now affected by ${status}!`)
  }
}

export function resolveEffectTargets(
  effectTarget: BattleEffectTarget,
  attacker: BattlePokemon,
  defender: BattlePokemon,
) {
  if (effectTarget === "both") {
    return [attacker, defender]
  }

  if (effectTarget === "target") {
    return [defender]
  }

  return [attacker]
}