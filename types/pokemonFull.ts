import { PokemonBasic, PokemonType } from "./pokemonBasic";
import { PokemonSpecies } from "./species";
import { PokemonStat } from "./stats";

export interface PokemonInfo {
  id: number,
  name: string,
  base_experience: number,
  types: PokemonType[],
  is_default: boolean,
  sprites: { 
    front_default: string; 
    back_default: string;
    front_shiny: string;
    back_shiny: string;
    other: {
      showdown: {
        front_default: string; 
        back_default: string;
        front_shiny: string;
        back_shiny: string;
      }
      "official-artwork": {
        front_default: string; 
        front_shiny: string;
      }
    }
  }
  species: PokemonSpecies,
  evolution_chain: PokemonBasic[],
  varieties: PokemonBasic[],
  stats: PokemonStat[],
  height: number,
  weight: number,
  abilities: PokemonAbility[],
  moves: PokemonMove[]
}

export interface PokemonAbility {
  is_hidden: boolean,
  slot: number,
  ability: {name: string, url: string}
}

export interface PokemonMove {
  move: Move
}

export interface Move {
  id: number,
  name: string,
  accuracy: number,
  effect_chance: number,
  pp: number,
  priority: number
  power: number,
  damage_class: MoveDamageClass
}

export interface MoveDamageClass {
  id: number,
  name: string,
  descriptions: {description: string}[]
}