import { NextRequest, NextResponse } from "next/server";
import { getPokemonInfo } from "@/lib/pokeapi/pokemon";

interface PokemonRouteProps {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, {params}: PokemonRouteProps) {
  const { id } = await params

  try {
    const pokemonData = await getPokemonInfo(id)
    return NextResponse.json(pokemonData)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || "Something went wrong!" }, { status: 500 })
  }
}