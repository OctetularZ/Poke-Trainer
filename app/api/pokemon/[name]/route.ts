import { NextRequest, NextResponse } from "next/server";

interface PokemonRouteProps {
  params: Promise<{ name: string }>
}

export interface PokemonInfo {
  id: number,
  name: string,
  base_experience: number,
  height: number
}

export async function GET(request: NextRequest, {params}: PokemonRouteProps) {
  const {name} = await params
  
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`)
    if (!res.ok) return NextResponse.json({error: "Could not find pokémon!"}, {status: res.status})
    
    const data: PokemonInfo = await res.json()

    const pokemonData = {id: data.id} as PokemonInfo

    return NextResponse.json(pokemonData)
  }
  catch(err) {
    console.log(err)
    return NextResponse.json({error: "Something went wrong!"}, {status: 500})
  }
}