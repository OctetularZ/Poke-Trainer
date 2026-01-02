import { PokemonSprites } from "./pokemon"

export interface EvolutionTree {
  id: number,
  name: string,
  slug?: string,
  pokeapiId?: number,
  sprites?: PokemonSprites,
  evolutions: Evolution[]
}

export interface Evolution {
  method: string,
  pokemon: EvolutionTree
}