import prisma from "@/lib/prisma";
import { EvolutionTree } from "@/types/evolution";

export async function getFullEvolutionChain(pokemonId: number): Promise<EvolutionTree> {
  // 1. Find the base Pokemon (traverse backwards)
  let base = await prisma.pokemon.findUnique({
    where: { id: pokemonId },
    select: {
      id: true,
      name: true,
      evolvesFrom: {
        include: {
          fromPokemon: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      }
    }
  });

  if (!base) {
    throw new Error(`Pokemon with id ${pokemonId} not found`);
  }

  // Keep going back until no more evolvesFrom
  while (base && base.evolvesFrom.length > 0) {
    const fromPokemon = base.evolvesFrom[0].fromPokemon;
    const newBase: any = await prisma.pokemon.findUnique({
      where: { id: fromPokemon.id },
      select: {
        id: true,
        name: true,
        evolvesFrom: {
          include: {
            fromPokemon: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    });

    if (!newBase) break;
    base = newBase;
  }

  // Build tree recursively from base
  async function buildTree(pokemon: any): Promise<EvolutionTree> {
    const evolutions = await prisma.evolution.findMany({
      where: { fromPokemonId: pokemon.id },
      include: {
        toPokemon: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return {
      ...pokemon,
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