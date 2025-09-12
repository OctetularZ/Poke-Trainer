import { NextRequest, NextResponse } from "next/server";
import { PokemonType } from "../route";
import { PokemonSpecies } from "../species/[id]/route";

interface PokemonRouteProps {
  params: Promise<{ name: string }>
}

export interface PokemonInfo {
  id: number,
  name: string,
  base_experience: number,
  types: PokemonType[],
  sprites: { 
    front_default: string; 
    back_default: string;
    other: {
      showdown: {
        front_default: string; 
        back_default: string;
      }
      "official-artwork": {
        front_default: string; 
        front_shiny: string;
      }
    } 
  }
  species: PokemonSpecies,
  height: number,
  weight: number,
  abilities: PokemonAbility[],
  moves: PokemonMove[]
}

export interface PokemonAbility {
  is_hidden: boolean,
  slot: number,
  ability: {name: string, url: string}
}

export interface PokemonMove {
  move: Move
}

export interface Move {
  id: number,
  name: string,
  accuracy: number,
  effect_chance: number,
  pp: number,
  priority: number
  power: number,
  damage_class: MoveDamageClass
}

export interface MoveDamageClass {
  id: number,
  name: string,
  descriptions: {description: string}[]
}

export async function GET(request: NextRequest, {params}: PokemonRouteProps) {
  const {name} = await params
  
  try {
    const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`)
    if (!pokemonRes.ok) return NextResponse.json({error: "Could not find pokémon!"}, {status: pokemonRes.status})
    
    const pokemon: PokemonInfo = await pokemonRes.json()

    const speciesRes = await fetch(`${process.env.PUBLIC_BASE_URL}/api/pokemon/species/${pokemon.id}`)
    if (!speciesRes.ok) return NextResponse.json({error: "Could not find pokémon species!"}, {status: speciesRes.status})
    
    const species: PokemonSpecies = await speciesRes.json()

    const pokemonData = {
      id: pokemon.id,
      name: pokemon.name,
      base_experience: pokemon.base_experience,
      types: pokemon.types,
      sprites: {
          front_default: pokemon.sprites.front_default ?? "",
          back_default: pokemon.sprites.back_default ?? "",
          other: {
            showdown: {
              front_default: pokemon.sprites.other.showdown.front_default ?? "",
              back_default: pokemon.sprites.other.showdown.back_default ?? ""
            },
            "official-artwork": {
              front_default: pokemon.sprites.other["official-artwork"].front_default ?? "",
              front_shiny: pokemon.sprites.other["official-artwork"].front_shiny ?? ""
            }
          }
        },
      species: species,
      height: pokemon.height,
      weight: pokemon.weight,
      abilities: pokemon.abilities,
      moves: pokemon.moves
    } as PokemonInfo

    return NextResponse.json(pokemonData)
  }
  catch(err) {
    console.log(err)
    return NextResponse.json({error: "Something went wrong!"}, {status: 500})
  }
}