import { BattleAction, BattlePokemon, BattleSide, BattleState } from "../types"
import { getStageMultiplier, shouldApplyChance } from "./effects"
import { getActivePokemon, hasAvailablePokemon, isPokemonFainted } from "./pokemon"
import { applySwitch, getAvailableSwitchIndexes } from "./switch"
import { applyAttack, getPokemonLabel } from "./move"

export function getEffectiveSpeed(pokemon: BattlePokemon) {
  const speedStage = pokemon.statStages?.speed ?? 0
  return Math.floor(pokemon.speed * getStageMultiplier(speedStage))
}

export function wakeUpChance(sleepTurnsElapsed: number){
  const safeTurns = Math.max(0, sleepTurnsElapsed)
  return Math.min(100, (safeTurns / 3) * 100)
}

export function actionPriority(state: BattleState, action: BattleAction) {
  if (action.type === "switch") return 10

  const actor = getActivePokemon(state, action.side)
  const move = actor.moves[action.moveIndex]
  return move?.priority ?? 0
}

export function shouldActFirst(state: BattleState, first: BattleAction, second: BattleAction) {
  const firstPriority = actionPriority(state, first)
  const secondPriority = actionPriority(state, second)

  if (firstPriority !== secondPriority) {
    return firstPriority > secondPriority
  }

  const firstSpeed = getEffectiveSpeed(getActivePokemon(state, first.side))
  const secondSpeed = getEffectiveSpeed(getActivePokemon(state, second.side))

  if (firstSpeed !== secondSpeed) {
    return firstSpeed > secondSpeed
  }

  return Math.random() >= 0.5
}

export function resolveAction(state: BattleState, action: BattleAction, events: string[]) {
  if (action.type === "switch") {
    applySwitch(state, action.side, action.toIndex, events)
    return
  }

  const actor = getActivePokemon(state, action.side)
  const actorLabel = getPokemonLabel(action.side, actor.name)
  if (isPokemonFainted(actor)) {
    events.push(`${actorLabel} couldn't move because it has fainted.`)
    return
  }

  if (actor.flinched) {
    actor.flinched = false
    events.push(`${actorLabel} flinched and couldn't move!`)
    return
  }

  if (actor.status === "paralysis") {
    const isFullyParalyzed = shouldApplyChance(25) // 25% chance to have turn skipped with paralysis.
    if (isFullyParalyzed) {
      events.push(`${actorLabel} is paralyzed and couldn't move!`)
      return
    }
  }

  if (actor.status === "freeze") {
    const isStillFrozen = shouldApplyChance(80) // 80% chance to stay frozen, and 20% to thaw out each turn.
    if (isStillFrozen) {
      events.push(`${actorLabel} is frozen solid and couldn't move!`)
      return
    }
    else {
      actor.status = null
      events.push(`${actorLabel} thawed out!`)
    }
  }

  if (actor.status === "sleep") {
    const chance = wakeUpChance(actor.sleepTurnsElapsed ?? 0)
    const wokeUp = shouldApplyChance(chance)

    if (wokeUp) {
      actor.status = null
      actor.sleepTurnsElapsed = 0
      events.push(`${actorLabel} woke up!`)
    }
    else {
      actor.sleepTurnsElapsed = (actor.sleepTurnsElapsed ?? 0) + 1
      events.push(`${actorLabel} is fast asleep...`)
      return
    }
  }

  applyAttack(state, action.side, action.moveIndex, events)
}

export function clearTurnVolatileFlags(state: BattleState) {
  state.player.pokemon.forEach((pokemon) => {
    pokemon.flinched = false
  })

  state.ai.pokemon.forEach((pokemon) => {
    pokemon.flinched = false
  })
}

export function forceAiSwitchIfFainted(state: BattleState, events: string[]) {
  if (state.winner) return

  const activeAiPokemon = getActivePokemon(state, "ai")
  if (!isPokemonFainted(activeAiPokemon)) return

  const availableSwitches = getAvailableSwitchIndexes(state, "ai")
  if (availableSwitches.length === 0) return

  const randomIndex = Math.floor(Math.random() * availableSwitches.length)
  const toIndex = availableSwitches[randomIndex]
  const previousAiIndex = state.ai.activeIndex
  applySwitch(state, "ai", toIndex, events)

  if (
    state.ai.activeIndex !== previousAiIndex &&
    state.pendingForcedSwitchSide === "ai"
  ) {
    state.pendingForcedSwitchSide = null
  }
}

export function setWinner(state: BattleState, winner: BattleSide, events: string[]) {
  if (state.winner) return

  state.winner = winner
  events.push(winner === "player" ? "You won!" : "Opponent has won!")
}

export function trySetWinnerIfNoPokemon(state: BattleState, events: string[]) {
  if (!hasAvailablePokemon(state, "player")) {
    setWinner(state, "ai", events)
    return true
  }

  if (!hasAvailablePokemon(state, "ai")) {
    setWinner(state, "player", events)
    return true
  }

  return false
}