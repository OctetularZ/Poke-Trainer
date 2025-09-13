import { NextRequest, NextResponse } from "next/server";
import { getPokemonList } from "@/lib/pokeapi/pokemon"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "12", 10)
  const offset = parseInt(searchParams.get("offset") || "0", 10)
  const typesParam = searchParams.get("types") || undefined
  const abilitiesParam = searchParams.get("abilities") || undefined

  try {
    const pokemon = await getPokemonList(limit, offset, typesParam, abilitiesParam)
    return NextResponse.json(pokemon)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 })
  }
}