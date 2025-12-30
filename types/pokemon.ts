import { GameMove } from "./moves";
import { PokemonType } from "./type";
import { PokemonAbility } from "./ability";
import { PokemonStats } from "./stats";
import { TypeEffectiveness } from "./type";
import { PokemonForm } from "./form";
import { EvolutionTree } from "./evolution";

export interface Pokemon {
  id: number,
  nationalNumber: string,
  name: string,
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
  base_experience?: string,
  stats?: PokemonStats,
  height?: string,
  weight?: string,
  abilities?: PokemonAbility[],
  moves?: GameMove[],
  typeChart?: TypeEffectiveness[],
  forms?: PokemonForm[],
  evolution_chain?: EvolutionTree,
  gameDescriptions?: GameDescription[]
}

export interface GameDescription {
  id: number,
  game: string,
  description: string
}