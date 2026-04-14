import { BattleSide, BattleState, BattleStatStages } from "../types"
import { isPokemonFainted } from "./pokemon"
import { cloneState } from "./state"

const DEFAULT_STAT_STAGES: BattleStatStages = {
  attack: 0,
  defense: 0,
  specialAttack: 0,
  specialDefense: 0,
  speed: 0,
  accuracy: 0,
  evasion: 0
}

export function handleForcedSwitch(currentState: BattleState, side: BattleSide, toIndex: number) {
  const state = cloneState(currentState)
  const events: string[] = []
  const prevIndex = state[side].activeIndex
  applySwitch(state, side, toIndex, events)

  if (state[side].activeIndex !== prevIndex) {
    state.pendingForcedSwitchSide = null
  }

  return {state, events}
}

export function applySwitch(state: BattleState, side: BattleSide, toIndex: number, events: string[]) {
  const current = state[side]
  const sideLabel = side === "player" ? "You" : "AI"
  const active = current.pokemon[current.activeIndex]
  if (active) {
    active.statStages = { ...DEFAULT_STAT_STAGES }
  }
  const target = current.pokemon[toIndex]

  if (!target || isPokemonFainted(target) || toIndex === current.activeIndex) {
    events.push(`${sideLabel} failed to switch.`)
    return
  }

  current.activeIndex = toIndex
  events.push(`${sideLabel} switched to ${target.name}.`)
}

export function getAvailableSwitchIndexes(state: BattleState, side: BattleSide) {
  const team = state[side]

  return team.pokemon
    .map((pokemon, index) => ({ pokemon, index }))
    .filter(({ pokemon, index }) => !isPokemonFainted(pokemon) && index !== team.activeIndex)
    .map(({ index }) => index)
}