import { EvolutionChain } from "@/types/evolution";
import { PokemonSpecies, FlavourText } from "@/types/species";
import { getPokemonEvolution } from "./evolution";

export async function getPokemonSpecies(url: string): Promise<PokemonSpecies> {
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error("Could not find pokémon's species!");
  }

  const data: PokemonSpecies = await res.json();

  const englishFlavorTexts: FlavourText[] = data.flavor_text_entries.filter(
    (entry) => entry.language.name === "en"
  );

  return {
    id: data.id,
    name: data.name,
    evolution_chain: data.evolution_chain,
    flavor_text_entries: englishFlavorTexts,
    varieties: data.varieties
  } as PokemonSpecies;
}