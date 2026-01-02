import { PokemonSprites } from "./pokemon"
import { PokemonType } from "./type"

export interface EvolutionTree {
  id: number,
  name: string,
  slug?: string,
  nationalNumber?: string,
  pokeapiId?: number,
  sprites?: PokemonSprites,
  types?: PokemonType[],
  evolutions: Evolution[]
}

export interface Evolution {
  method: string,
  pokemon: EvolutionTree
}