import prisma from "@/lib/prisma";
import { Pokemon } from "@/types/pokemon";

export async function getPokemonInfo(name: string): Promise<Pokemon> {
  const pokemon = await prisma.pokemon.findUnique({
    where: { name: name },
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
          name: true,
          pokemon: {
            select: {
              name: true
            }
          }
        }
      }
    }
  })

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.pokeapiId}/`)
  if (!res.ok) throw new Error(`Could not find ${name}`)
  const pokeApiData = await res.json()

  const stats = {
    hpBase: pokemon?.hpBase, 
    hpMin: pokemon?.hpMin, 
    hpMax: pokemon?.hpMax,
    attackBase: pokemon?.attackBase,
    attackMin: pokemon?.attackMin,
    attackMax: pokemon?.attackMax,
    defenseBase: pokemon?.defenseBase,
    defenseMin: pokemon?.defenseMin,
    defenseMax: pokemon?.defenseMax,
    spAtkBase: pokemon?.spAtkBase,
    spAtkMin: pokemon?.spAtkMin,
    spAtkMax: pokemon?.spAtkMax,
    spDefBase: pokemon?.spDefBase,
    spDefMin: pokemon?.spDefMin,
    spDefMax: pokemon?.spDefMax,
    speedBase: pokemon?.speedBase,
    speedMin: pokemon?.speedMin,
    speedMax: pokemon?.speedMax,
  }

  // const evolution_chain: EvolutionChain = await getPokemonEvolution(species.evolution_chain.url);

  // const evolutionSpeciesList = await getEvolutionSpeciesData(evolution_chain.chain)

  // const typesInfo = await getPokemonTypesInformation(pokemon.types)

  // const moves = await getPokemonMoves(pokemon.moves)

  return {
    id: pokemon.id,
    nationalNumber: pokemon.nationalNumber,
    name: pokemon.name,
    base_experience: pokemon.baseExp,
    types: pokemon.types,
    sprites: {
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
    },
    stats: stats,
    height: pokemon.height,
    weight: pokemon.weight,
    abilities: pokemon.abilities,
    moves: pokemon.gameMoves,
    typeChart: pokemon.typeChart,
    forms: pokemon.forms,

    // evolution_chain: evolutionSpeciesList,
    // varieties: varieties,
  } as Pokemon
}