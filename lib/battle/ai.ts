import { BattleAction, BattleState } from "./types"

function canSwitch(state: BattleState, side: "ai" | "player", toIndex: number) {
  const team = state[side].pokemon
  const activeIndex = state[side].activeIndex
  const target = team[toIndex]

  return Boolean(target) && target.currentHp > 0 && !target.fainted && toIndex !== activeIndex
}

export function chooseRandomAiAction(state: BattleState): BattleAction {
  const activePokemon = state.ai.pokemon[state.ai.activeIndex]
  const legalMoves = activePokemon.moves
    .map((_, index) => index)
    .filter((index) => Boolean(activePokemon.moves[index]))

  const legalSwitches = state.ai.pokemon
    .map((_, index) => index)
    .filter((index) => canSwitch(state, "ai", index))

  if ((activePokemon.fainted || activePokemon.currentHp <= 0) && legalSwitches.length > 0) {
    const toIndex = legalSwitches[Math.floor(Math.random() * legalSwitches.length)]
    return { type: "switch", side: "ai", toIndex }
  }

  if (legalMoves.length === 0 && legalSwitches.length > 0) {
    const toIndex = legalSwitches[Math.floor(Math.random() * legalSwitches.length)]
    return { type: "switch", side: "ai", toIndex }
  }

  const moveIndex = legalMoves[Math.floor(Math.random() * legalMoves.length)] ?? 0
  return {
    type: "move",
    side: "ai",
    moveIndex,
  }
}
