export interface urlData {
  name: string;
  url: string;
}

export interface PokemonBasic {
  id: number;
  name: string;
  is_default: boolean;
  types: PokemonType[];
  sprites: { front_default: string; back_default: string };
  showdown: { front_default: string; back_default: string };
  officialArtwork: {front_default: string}
}

export interface PokemonType {
  slot: number;
  type: Type;
}

export interface Type {
  name: string;
  url: string;
}

export interface TypeOfPokemon {
  slot: number;
  pokemon: urlData;
}