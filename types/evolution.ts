import { Item } from "./item"
import { PokemonSpecies } from "./species"

export interface EvolutionChain {
  id: number,
  chain: ChainLink
}

export interface ChainLink {
  evolution_details: EvolutionDetails[]
  evolves_to: ChainLink[]
  is_baby: boolean
  species: {name: string, url: string}
}

export interface EvolutionDetails {
  item: Item,
  trigger: EvolutionTrigger
  gender: number,
  held_item: Item,
  min_level: number,
  min_happiness: number,
  min_beauty: number,
  min_affection: number,
  time_of_day: string
}

export interface EvolutionTrigger {
  id: number,
  name: string,
  pokemon_species: PokemonSpecies
}