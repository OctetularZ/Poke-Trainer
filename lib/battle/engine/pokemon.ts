import { BattlePokemon, BattleSide, BattleState } from "../types";

// Checks if a Pokémon is fainted
export function isPokemonFainted(pokemon: BattlePokemon) {
  return pokemon.fainted || pokemon.currentHp <= 0
}

// Checks if a side has available Pokémon
export function hasAvailablePokemon(state: BattleState, side: BattleSide) {
  return state[side].pokemon.some((pokemon) => !isPokemonFainted(pokemon))
}

// Gets all active Pokémon of a side
export function getActivePokemon(state: BattleState, side: BattleSide): BattlePokemon {
  const team = state[side]
  return team.pokemon[team.activeIndex]
}