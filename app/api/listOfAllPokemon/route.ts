import { NextRequest, NextResponse } from "next/server";
import { getPokemonListFull } from "@/lib/pokeapi/pokemon"

// Gets a list of all Pokémon

// Takes a limit, incremental, and type and ability filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "50", 10)
  const offset = parseInt(searchParams.get("offset") || "0", 10)
  const typesParam = searchParams.get("types") || undefined
  const abilitiesParam = searchParams.get("abilities") || undefined

  try {
    const pokemon = await getPokemonListFull(limit, offset, typesParam, abilitiesParam)
    return NextResponse.json(pokemon)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 })
  }
}