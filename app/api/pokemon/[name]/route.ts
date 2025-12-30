import { NextRequest, NextResponse } from "next/server";
import { getPokemonInfo } from "@/lib/pokeapi/pokemon";
import { getPokemonName } from "@/lib/pokeapi/helpers/getPokemonSlug";

interface PokemonRouteProps {
  params: Promise<{ name: string }>
}

export async function GET(request: NextRequest, {params}: PokemonRouteProps) {
  const { name } = await params
  const searchName = getPokemonName(name)

  try {
    const pokemonData = await getPokemonInfo(searchName)
    return NextResponse.json(pokemonData)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || "Something went wrong!" }, { status: 500 })
  }
}