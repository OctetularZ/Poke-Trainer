import { PokemonSpecies, FlavourText } from "@/types/species";

export async function getPokemonSpecies(id: string): Promise<PokemonSpecies> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
  
  if (!res.ok) {
    throw new Error("Could not find pokémon's species!");
  }

  const data: PokemonSpecies = await res.json();

  const englishFlavorTexts: FlavourText[] = data.flavor_text_entries.filter(
    (entry) => entry.language.name === "en"
  );

  return {
    evolution_chain: data.evolution_chain,
    flavor_text_entries: englishFlavorTexts
  } as PokemonSpecies;
}