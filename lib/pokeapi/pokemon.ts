import prisma from "@/lib/prisma";
import { Pokemon } from "@/types/pokemon";
import { getFullEvolutionChain } from "./evolution";
import { fetchPokemonForms } from "./helpers/fetchPokemonForms";
import { fetchSprites } from "./helpers/fetchSprites";

export async function getPokemonBasic(name?: string, slug?: string): Promise<Pokemon> {
  let pokemon = null;
  if (slug) {
    pokemon = await prisma.pokemon.findUnique({
      where: {slug: slug},
      include: {

        // Pokemon's Types
        types: {
          select: {
            name: true
          }
        },
      }
    })
  }
  else if (name) {
    pokemon = await prisma.pokemon.findUnique({
      where: {name: name},
      include: {

        // Pokemon's Types
        types: {
          select: {
            name: true
          }
        },
      }
    })
  }
  else {
    throw new Error("Either name or slug must be provided!")
  }

  if (!pokemon) throw new Error(`Could not find Pokémon: ${name || slug}`);

  const sprites = await fetchSprites(pokemon.pokeapiId!)

  return {
    id: pokemon.id,
    slug: pokemon.slug,
    nationalNumber: pokemon.nationalNumber,
    name: pokemon.name,
    types: pokemon.types,
    sprites,
  } as Pokemon
}

export async function getPokemonInfo(slug: string): Promise<Pokemon> {
  const pokemon = await prisma.pokemon.findUnique({
    where: {slug: slug},
    include: {

      // Pokemon's Types
      types: {
        select: {
          name: true
        }
      },

      // Pokemon's Abilities
      abilities: {
        select: {
          name: true
        }
      },

      // Pokemon's Moves
      gameMoves: {
        select: {
          method: true,
          level: true,
          tmNumber: true,
          move: {
            select: {
              name: true,
              type: true,
              category: true,
              power: true,
              accuracy: true
            }
          },
          game: {
            select: {
              name: true
            }
          }
        }
      },

      // Pokemon's Type Chart
      typeChart: {
        select: {
          attackType: true,
          multiplier: true
        }
      },

      // Pokemon's Forms
      forms: {
        select: {
          id: true,
          name: true
        }
      },

      // Game Descriptions
      descriptions: {
        select: {
          id: true,
          game: true,
          description: true
        }
      }
    }
  })

  if (!pokemon) throw new Error(`Could not find Pokémon: ${slug}`);

  const sprites = await fetchSprites(pokemon.pokeapiId!)

  const stats = {
    hpBase: pokemon.hpBase, 
    hpMin: pokemon.hpMin, 
    hpMax: pokemon.hpMax,
    attackBase: pokemon.attackBase,
    attackMin: pokemon.attackMin,
    attackMax: pokemon.attackMax,
    defenseBase: pokemon.defenseBase,
    defenseMin: pokemon.defenseMin,
    defenseMax: pokemon.defenseMax,
    spAtkBase: pokemon.spAtkBase,
    spAtkMin: pokemon.spAtkMin,
    spAtkMax: pokemon.spAtkMax,
    spDefBase: pokemon.spDefBase,
    spDefMin: pokemon.spDefMin,
    spDefMax: pokemon.spDefMax,
    speedBase: pokemon.speedBase,
    speedMin: pokemon.speedMin,
    speedMax: pokemon.speedMax,
  }

  const evolutionChain = await getFullEvolutionChain(pokemon.id);
  // console.log("Chain captured successfully!");
  // console.log(evolutionChain);
  const pokemonForms = await fetchPokemonForms(pokemon.forms)

  return {
    id: pokemon.id,
    slug: pokemon.slug,
    nationalNumber: pokemon.nationalNumber,
    name: pokemon.name,
    base_experience: pokemon.baseExp,
    types: pokemon.types,
    sprites,
    stats: stats,
    height: pokemon.height,
    weight: pokemon.weight,
    abilities: pokemon.abilities,
    moves: pokemon.gameMoves,
    typeChart: pokemon.typeChart,
    forms: pokemonForms,
    evolution_chain: evolutionChain,
    gameDescriptions: pokemon.descriptions
  } as Pokemon
}

export async function getPokemonList(
  limit: number,
  offset: number,
  typesParam?: string,
  abilitiesParam?: string
): Promise<Pokemon[]> {
  
  const typeNames = typesParam?.split(",");
  const abilityNames = abilitiesParam?.split(",");
  
  // Fetch Pokemon from DB who have all selected types/abilities
  const pokemonList = await prisma.pokemon.findMany({
    where: {
      AND: [
        ...(typeNames ? typeNames.map(typeName => ({
          types: {
            some: {
              name: { 
                equals: typeName,
                mode: 'insensitive' as const
              }
            }
          }
        })) : []),
        ...(abilityNames ? abilityNames.map(abilityName => ({
          abilities: {
            some: {
              name: { 
                equals: abilityName,
                mode: 'insensitive' as const
              }
            }
          }
        })) : [])
      ]
    },
    take: limit,
    skip: offset,
    select: {
      id: true,
      slug: true,
      nationalNumber: true,
      name: true,
      pokeapiId: true,
      types: { select: { name: true } }
    }
  });

  // Fetch sprites for all Pokemon in parallel
  const pokemonListWithSprites = await Promise.all(
    pokemonList.map(async (pokemon) => {
      const sprites = await fetchSprites(pokemon.pokeapiId!);
      
      if (!sprites) {
        console.error(`Could not fetch sprites for ${pokemon.name}`);
      }
      
      return {
        ...pokemon,
        sprites: sprites || {
          front_default: "",
          back_default: "",
          front_shiny: "",
          back_shiny: "",
          other: {
            showdown: {
              front_default: "",
              back_default: "",
              front_shiny: "",
              back_shiny: "",
            },
            "official-artwork": {
              front_default: "",
              front_shiny: "",
            },
          },
        }
      } as Pokemon;
    })
  );

  return pokemonListWithSprites;

}