import { PokemonAbility } from "./ability"
import { GameMove, Move } from "./moves"
import { Pokemon, PokemonSprites } from "./pokemon"
import { PokemonType } from "./type"

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
  active: boolean
  createdAt?: Date
  updatedAt?: Date
  members: TeamMember[]
}

export interface TeamMember {
  id: number
  slot: number
  nature?: string
  evHp?: number
  evAtk?: number
  evSpAtk?: number
  evDef?: number
  evSpDef?: number
  evSpeed?: number
  ability: PokemonAbility
  pokemon: TeamPokemon
  moves: TeamMemberMove[]
}

export interface TeamPokemon {
  id: number
  name: string
  pokeapiId: number | null
  sprites: PokemonSprites
  hpBase?: number
  attackBase?: number
  spAtkBase?: number
  defenseBase?: number
  spDefBase?: number
  speedBase?: number
  types?: PokemonType[]
}

export interface TeamMemberMove {
  id: number
  slot: number
  gameMove: {
    move: Move
  }
}