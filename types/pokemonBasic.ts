export interface PokemonBasic {
  id: number;
  name: string;
  types: PokemonType[];
  sprites: { front_default: string; back_default: string };
  showdown: { front_default: string; back_default: string };
  officialArtwork: {front_default: string}
}

export interface PokemonType {
  name: string;
}