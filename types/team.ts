import { PokemonAbility } from "./ability"
import { GameMove, Move } from "./moves"
import { Pokemon, PokemonSprites } from "./pokemon"

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

export interface Team {
  id: number
  name: string | null
  createdAt: Date
  updatedAt: Date
  members: TeamMember[]
}

export interface TeamMember {
  ability: PokemonAbility
  pokemon: TeamPokemon
  moves: TeamMemberMove[]
}

export interface TeamPokemon {
  id: number
  name: string
  pokeapiId: number | null
  sprites: PokemonSprites
}

export interface TeamMemberMove {
  id: number
  slot: number
  gameMove: {
    move: Move
  }
}

export interface TeamMove extends Move {
  slot: number
}