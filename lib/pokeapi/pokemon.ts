import { urlData, PokemonBasic, TypeOfPokemon } from "@/types/pokemonBasic";
import { PokemonInfo } from "@/types/pokemonFull";
import { PokemonSpecies } from "@/types/species";
import { getPokemonSpecies } from "@/lib/pokeapi/species";
import { getPokemonEvolution } from "./evolution";
import { ChainLink, EvolutionChain } from "@/types/evolution";
import { pokemonNameFetchHandle } from "./helpers/pokemonNameFetchHandle";

const getPokemonBasic = async (name: string): Promise<PokemonBasic> => {
  if (name in pokemonNameFetchHandle) name = pokemonNameFetchHandle[name]
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`)
  if (!res.ok) throw new Error(`Could not find ${name}`)
  const data = await res.json()
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
  }
}

export const getEvolutionSpeciesData = async (
  evolutionChain: ChainLink
): Promise<PokemonBasic[]> => {
  const currentPokemon = await getPokemonBasic(evolutionChain.species.name)

  const evolvedPokemonLists = await Promise.all(
    evolutionChain.evolves_to.map(evolution =>
      getEvolutionSpeciesData(evolution)
    )
  )

  return [currentPokemon, ...evolvedPokemonLists.flat()]
}


export async function getPokemonList(
  limit: number,
  offset: number,
  typesParam?: string,
  abilitiesParam?: string
): Promise<PokemonBasic[]> {
  let pokemonList: urlData[] = []

  if (typesParam || abilitiesParam) {
    let typeFiltered: Record<string, urlData> = {}
    let typeCounts: Record<string, number> = {}
    let abilityFiltered: Record<string, urlData> = {}
    let abilityCounts: Record<string, number> = {}

    // Type filtering
    if (typesParam) {
      const typeNames = typesParam.split(",")
      for (let type of typeNames) {
        const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${type}`)
        const typeData = await typeRes.json()
        typeData.pokemon.forEach((p: TypeOfPokemon) => {
          if (!typeFiltered[p.pokemon.name]) {
            typeFiltered[p.pokemon.name] = p.pokemon
          }
          typeCounts[p.pokemon.name] = (typeCounts[p.pokemon.name] || 0) + 1
        })
      }
    }

    // Ability filtering
    if (abilitiesParam) {
      const abilityNames = abilitiesParam.split(",")
      for (let ability of abilityNames) {
        const abilityRes = await fetch(`https://pokeapi.co/api/v2/ability/${ability}`)
        const abilityData = await abilityRes.json()
        abilityData.pokemon.forEach((p: any) => {
          const poke = p.pokemon
          if (!abilityFiltered[poke.name]) {
            abilityFiltered[poke.name] = poke
          }
          abilityCounts[poke.name] = (abilityCounts[poke.name] || 0) + 1
        })
      }
    }

    // Combine filters (intersection)
    if (typesParam && abilitiesParam) {
      const typeNames = typesParam.split(",")
      const abilityNames = abilitiesParam.split(",")
      pokemonList = Object.keys(typeFiltered)
        .filter(
          (name) =>
            typeCounts[name] === typeNames.length &&
            abilityCounts[name] === abilityNames.length
        )
        .map((name) => typeFiltered[name])
    } else if (typesParam) {
      const typeNames = typesParam.split(",")
      pokemonList = Object.entries(typeCounts)
        .filter(([_, count]) => count === typeNames.length)
        .map(([name]) => typeFiltered[name])
    } else if (abilitiesParam) {
      const abilityNames = abilitiesParam.split(",")
      pokemonList = Object.entries(abilityCounts)
        .filter(([_, count]) => count === abilityNames.length)
        .map(([name]) => abilityFiltered[name])
    }
  } else {
    // Normal fetch if no filter selected
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`)
    const data = await res.json()
    pokemonList = data.results
  }

  const paginated =
    typesParam || abilitiesParam
      ? pokemonList.slice(offset, offset + limit)
      : pokemonList

  const detailedPromises = paginated.map(async (p: urlData) => {
    const res = await fetch(p.url)
    const data = await res.json()

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
      officialArtwork: data.sprites.other?.["official-artwork"]?.front_default ?? "",
    } as PokemonBasic
  })

  const pokemonData = await Promise.all(detailedPromises)
  return pokemonData.filter((p) => p.is_default)
}

export async function getPokemonInfo(name: string): Promise<PokemonInfo> {
  const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`)
  if (!pokemonRes.ok) {
    throw new Error("Could not find pokémon!")
  }

  const pokemon: PokemonInfo = await pokemonRes.json()

  const species: PokemonSpecies = await getPokemonSpecies(pokemon.id.toString());

  const evolution_chain: EvolutionChain = await getPokemonEvolution(species.evolution_chain.url);

  const evolutionSpeciesList = await getEvolutionSpeciesData(evolution_chain.chain)

  return {
    id: pokemon.id,
    name: pokemon.name,
    base_experience: pokemon.base_experience,
    types: pokemon.types,
    sprites: {
      front_default: pokemon.sprites.front_default ?? "",
      back_default: pokemon.sprites.back_default ?? "",
      front_shiny: pokemon.sprites.front_shiny ?? "",
      back_shiny: pokemon.sprites.back_shiny ?? "",
      other: {
        showdown: {
          front_default: pokemon.sprites.other.showdown.front_default ?? "",
          back_default: pokemon.sprites.other.showdown.back_default ?? "",
          front_shiny: pokemon.sprites.other.showdown.front_shiny ?? "",
          back_shiny: pokemon.sprites.other.showdown.back_shiny ?? "",
        },
        "official-artwork": {
          front_default: pokemon.sprites.other["official-artwork"].front_default ?? "",
          front_shiny: pokemon.sprites.other["official-artwork"].front_shiny ?? "",
        },
      },
    },
    species: species,
    evolution_chain: evolutionSpeciesList,
    height: pokemon.height,
    weight: pokemon.weight,
    abilities: pokemon.abilities,
    moves: pokemon.moves,
  } as PokemonInfo
}