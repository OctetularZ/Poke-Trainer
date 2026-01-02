import { GameMove } from "./moves";
import { PokemonType } from "./type";
import { PokemonAbility } from "./ability";
import { PokemonStats } from "./stats";
import { TypeEffectiveness } from "./type";
import { EvolutionTree } from "./evolution";

export interface Pokemon {
  id: number,
  slug: string,
  nationalNumber: string,
  name: string,
  types: PokemonType[],
  sprites: PokemonSprites,
  pokeapiId?: number,
  base_experience?: string,
  stats?: PokemonStats,
  height?: string,
  weight?: string,
  abilities?: PokemonAbility[],
  moves?: GameMove[],
  typeChart?: TypeEffectiveness[],
  forms?: Pokemon[],
  evolution_chain?: EvolutionTree,
  evolvesTo?: Array<{
    id: number;
    method: string;
    fromPokemon: {
      id: number;
      name: string;
    };
    fromPokemonId: number;
    toPokemon: {
      id: number;
      name: string;
    };
    toPokemonId: number;
  }>,
  gameDescriptions?: GameDescription[]
}

export interface GameDescription {
  id: number,
  game: string,
  description: string
}

export interface PokemonSprites {
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
    };
    "official-artwork": {
      front_default: string;
      front_shiny: string;
    };
  };
}