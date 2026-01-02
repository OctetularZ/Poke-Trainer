import { PokemonSprites } from "@/types/pokemon";

export async function fetchSprites(pokeapiId: number): Promise<PokemonSprites | undefined> {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeapiId}/`);
    if (!res.ok) return undefined;
    
    const pokeApiData = await res.json();
    
    return {
      front_default: pokeApiData.sprites.front_default ?? "",
      back_default: pokeApiData.sprites.back_default ?? "",
      front_shiny: pokeApiData.sprites.front_shiny ?? "",
      back_shiny: pokeApiData.sprites.back_shiny ?? "",
      other: {
        showdown: {
          front_default: pokeApiData.sprites.other.showdown.front_default ?? "",
          back_default: pokeApiData.sprites.other.showdown.back_default ?? "",
          front_shiny: pokeApiData.sprites.other.showdown.front_shiny ?? "",
          back_shiny: pokeApiData.sprites.other.showdown.back_shiny ?? "",
        },
        "official-artwork": {
          front_default: pokeApiData.sprites.other["official-artwork"].front_default ?? "",
          front_shiny: pokeApiData.sprites.other["official-artwork"].front_shiny ?? "",
        },
      },
    };
  } catch (error) {
    console.error(`Error fetching sprites for pokeapiId ${pokeapiId}:`, error);
    return undefined;
  }
}
