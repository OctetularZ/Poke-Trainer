import { Move } from "./moves";
import { PokemonBasic, PokemonType } from "./pokemonBasic";
import { PokemonStats } from "./stats";
import { TypeInfo } from "./type";

export interface PokemonInfo {
  id: number,
  nationalNumber: string,
  name: string,
  base_experience: string,
  types: PokemonType[],
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
  stats: PokemonStats[],
  height: string,
  weight: string,

  evolution_chain: PokemonBasic[],
  varieties: PokemonBasic[],
  types_info: TypeInfo[],
  moves: Move[],
  abilities: PokemonAbility[],
}

export interface PokemonAbility {
  is_hidden: boolean,
  slot: number,
  ability: {name: string, url: string}
}