import { BattlePokemon, BattleSide, BattleState } from "../types";

export function isPokemonFainted(pokemon: BattlePokemon) {
  return pokemon.fainted || pokemon.currentHp <= 0
}

export function hasAvailablePokemon(state: BattleState, side: BattleSide) {
  return state[side].pokemon.some((pokemon) => !isPokemonFainted(pokemon))
}

export function getActivePokemon(state: BattleState, side: BattleSide): BattlePokemon {
  const team = state[side]
  return team.pokemon[team.activeIndex]
}