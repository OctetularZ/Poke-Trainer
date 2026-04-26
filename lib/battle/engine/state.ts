import { BattleState } from "../types";

// Clones state (allows it to be edited before applying on frontend)
export function cloneState(state: BattleState): BattleState {
  return {
    ...state,
    player: {
      ...state.player,
      pokemon: state.player.pokemon.map((p) => ({
        ...p,
        moves: p.moves.map((move) => ({ ...move })),
      })),
    },
    ai: {
      ...state.ai,
      pokemon: state.ai.pokemon.map((p) => ({
        ...p,
        moves: p.moves.map((move) => ({ ...move })),
      })),
    },
    battleLog: [...state.battleLog],
  }
}