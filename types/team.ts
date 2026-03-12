import { PokemonAbility } from "./ability"
import { GameMove } from "./moves"
import { Pokemon } from "./pokemon"

export interface PokemonBuild {
  pokemon: Pokemon
  nature: string
  ability: PokemonAbility
  evs: EVStats
  moves: GameMove[]
}

export interface EVStats {
  hp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
}