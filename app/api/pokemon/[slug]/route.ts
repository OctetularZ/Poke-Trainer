import { NextRequest, NextResponse } from "next/server";
import { getPokemonInfo } from "@/lib/pokeapi/pokemon";

interface PokemonRouteProps {
  params: Promise<{ slug: string }>
}

export async function GET(request: NextRequest, {params}: PokemonRouteProps) {
  const { slug } = await params

  try {
    const pokemonData = await getPokemonInfo(slug)
    return NextResponse.json(pokemonData)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || "Something went wrong!" }, { status: 500 })
  }
}