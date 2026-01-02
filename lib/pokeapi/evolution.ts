import prisma from "@/lib/prisma";
import { EvolutionTree } from "@/types/evolution";
import { Pokemon } from "@/types/pokemon";
import { fetchSprites } from "./helpers/fetchSprites";

export async function getPokemonWithEvolution(pokemonId: number): Promise<Pokemon> {
  const pokemon = await prisma.pokemon.findUnique({
    where: { id: pokemonId },
    select: {
      id: true,
      name: true,
      slug: true,
      pokeapiId: true,
      nationalNumber: true,
      types: {
        select: {
          name: true
        }
      },
      evolvesTo: {
        include: {
          fromPokemon: {
            select: {
              id: true,
              name: true,
            }
          },
        }
      }
    }
  });

  if (!pokemon) throw new Error(`Could not find Pokémon with ID: ${pokemonId}`);

  const sprites = await fetchSprites(pokemon.pokeapiId!);
  if (!sprites) throw new Error(`Could not fetch sprites for Pokémon with ID: ${pokemonId}`);

  return {
    id: pokemon.id,
    slug: pokemon.slug,
    nationalNumber: pokemon.nationalNumber,
    name: pokemon.name,
    types: pokemon.types,
    pokeapiId: pokemon.pokeapiId,
    evolvesTo: pokemon.evolvesTo,
    sprites
  } as Pokemon
}


export async function getFullEvolutionChain(pokemonId: number): Promise<EvolutionTree> {
  // Find the base Pokemon (traverse backwards)
  let base = await getPokemonWithEvolution(pokemonId)

  if (!base) {
    throw new Error(`Pokemon with id ${pokemonId} not found`);
  }

  // Keep going back until no more evolvesTo
  const visitedIds = new Set<number>();
  visitedIds.add(base.id);
  
  while (base && base.evolvesTo && base.evolvesTo.length > 0) {
    const fromPokemon = base.evolvesTo[0].fromPokemon;
    
    // Prevent infinite loop if there's a circular reference
    if (visitedIds.has(fromPokemon.id)) {
      break;
    }
    
    const newBase = await getPokemonWithEvolution(fromPokemon.id)

    if (!newBase) break;
    visitedIds.add(newBase.id);
    base = newBase;
  }

  // Build tree recursively from base
  const visited = new Set<number>();
  
  async function buildTree(pokemon: any): Promise<EvolutionTree> {
    // Prevent infinite recursion
    if (visited.has(pokemon.id)) {
      const sprites = pokemon.pokeapiId ? await fetchSprites(pokemon.pokeapiId) : undefined;
      return {
        id: pokemon.id,
        name: pokemon.name,
        slug: pokemon.slug,
        nationalNumber: pokemon.nationalNumber,
        pokeapiId: pokemon.pokeapiId,
        sprites,
        types: pokemon.types,
        evolutions: []
      };
    }
    
    visited.add(pokemon.id);

    const evolutions = await prisma.evolution.findMany({
      where: { fromPokemonId: pokemon.id },
      include: {
        toPokemon: {
          select: {
            id: true,
            name: true,
            slug: true,
            nationalNumber: true,
            pokeapiId: true,
            types: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    // Fetch sprites from PokeAPI if pokeapiId exists
    const sprites = pokemon.pokeapiId ? await fetchSprites(pokemon.pokeapiId) : undefined;

    return {
      id: pokemon.id,
      name: pokemon.name,
      slug: pokemon.slug,
      nationalNumber: pokemon.nationalNumber,
      pokeapiId: pokemon.pokeapiId,
      sprites,
      types: pokemon.types,
      evolutions: await Promise.all(
        evolutions.map(async evo => ({
          method: evo.method,
          pokemon: await buildTree(evo.toPokemon)
        }))
      )
    };
  }

  return buildTree(base);
}