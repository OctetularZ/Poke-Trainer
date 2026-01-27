import { NextRequest, NextResponse } from "next/server";
import { getRandomPokemon } from "@/lib/pokeapi/pokemon"

export async function GET(request: NextRequest) {
  try {
    const pokemon = await getRandomPokemon()
    return NextResponse.json(pokemon)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 })
  }
}