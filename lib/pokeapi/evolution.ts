import { EvolutionChain } from "@/types/evolution";

export async function getPokemonEvolution(url: string): Promise<EvolutionChain> {
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error("Could not find pokémon evolution chain!");
  }

  const data: EvolutionChain = await res.json();

  return {
    id: data.id,
    chain: data.chain
  } as EvolutionChain;
}