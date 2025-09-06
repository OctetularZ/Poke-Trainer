import { NextRequest, NextResponse } from "next/server";

interface PokemonRouteProps {
  params: Promise<{ name: string }>
}

export interface PokemonInfo {
  id: number,
  name: string,
  base_experience: number,
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
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`)
    if (!res.ok) return NextResponse.json({error: "Could not find pokémon!"}, {status: res.status})
    
    const data: PokemonInfo = await res.json()

    const pokemonData = {
      id: data.id,
      name: data.name,
      base_experience: data.base_experience,
      height: data.height,
      weight: data.weight,
      abilities: data.abilities,
      moves: data.moves
    } as PokemonInfo

    return NextResponse.json(pokemonData)
  }
  catch(err) {
    console.log(err)
    return NextResponse.json({error: "Something went wrong!"}, {status: 500})
  }
}