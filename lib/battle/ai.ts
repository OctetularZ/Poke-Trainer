import { BattleAction, BattleState } from "./types"

function canSwitch(state: BattleState, side: "ai" | "player", toIndex: number) {
  const team = state[side].pokemon
  const activeIndex = state[side].activeIndex
  const target = team[toIndex]

  return Boolean(target) && target.currentHp > 0 && !target.fainted && toIndex !== activeIndex
}

export function chooseRandomAiAction(state: BattleState): BattleAction {
  // Get AI's active Pokémon
  const activePokemon = state.ai.pokemon[state.ai.activeIndex]

  // Gets legal moves for active Pokémon
  const legalMoves = activePokemon.moves
    .map((_, index) => index)
    .filter((index) => Boolean(activePokemon.moves[index]))

  // Checks for legal switches
  const legalSwitches = state.ai.pokemon
    .map((_, index) => index)
    .filter((index) => canSwitch(state, "ai", index))

  // Switch Pokémon if active Pokémon has fainted.
  if ((activePokemon.fainted || activePokemon.currentHp <= 0) && legalSwitches.length > 0) {
    const toIndex = legalSwitches[Math.floor(Math.random() * legalSwitches.length)]
    return { type: "switch", side: "ai", toIndex }
  }

  // Switch Pokémon if no legal moves or switches
  if (legalMoves.length === 0 && legalSwitches.length > 0) {
    const toIndex = legalSwitches[Math.floor(Math.random() * legalSwitches.length)]
    return { type: "switch", side: "ai", toIndex }
  }

  // Choose a random move from active Pokémon moveset
  const moveIndex = legalMoves[Math.floor(Math.random() * legalMoves.length)] ?? 0
  return {
    type: "move",
    side: "ai",
    moveIndex,
  }
}
