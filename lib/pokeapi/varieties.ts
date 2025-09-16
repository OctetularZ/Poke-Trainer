import { PokemonBasic } from "@/types/pokemonBasic";
import { Variety } from "@/types/species";

export async function getPokemonVarieties(varieties: Variety[]): Promise<PokemonBasic[]> {
  const promises = varieties.map(async (variety) => {
    const res = await fetch(variety.pokemon.url);

    if (!res.ok) {
      throw new Error(`Could not fetch Pokémon: ${variety.pokemon.name}`);
    }

    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      is_default: data.is_default,
      types: data.types,
      sprites: {
        front_default: data.sprites.front_default ?? "",
        back_default: data.sprites.back_default ?? "",
      },
      showdown: {
        front_default: data.sprites.other?.showdown?.front_default ?? "",
        back_default: data.sprites.other?.showdown?.back_default ?? "",
      },
      officialArtwork: {
        front_default: data.sprites.other?.["official-artwork"]?.front_default ?? "",
      },
    } as PokemonBasic;
  });

  return Promise.all(promises);
}