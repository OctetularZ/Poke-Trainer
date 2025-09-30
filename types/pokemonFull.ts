import { Move } from "./moves";
import { PokemonBasic, PokemonType } from "./pokemonBasic";
import { PokemonSpecies } from "./species";
import { PokemonStat } from "./stats";
import { TypeInfo } from "./type";

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
  },
  species: PokemonSpecies,
  evolution_chain: PokemonBasic[],
  varieties: PokemonBasic[],
  types_info: TypeInfo[],
  moves: Move[],
  stats: PokemonStat[],
  height: number,
  weight: number,
  abilities: PokemonAbility[],
}

export interface PokemonAbility {
  is_hidden: boolean,
  slot: number,
  ability: {name: string, url: string}
}