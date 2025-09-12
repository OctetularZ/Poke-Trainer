import { NextRequest, NextResponse } from "next/server";
import { PokemonType } from "../../route";

interface SpeciesRouteProps {
  params: Promise<{ id: string }>
}

export interface PokemonSpecies {
  flavor_text_entries: FlavourText[]
}

export interface FlavourText {
  flavor_text: string,
  language: {
    name: string,
    url: string
  }
}

export async function GET(request: NextRequest, {params}: SpeciesRouteProps) {
  const {id} = await params

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
    if (!res.ok) return NextResponse.json({error: "Could not find pokémon's species!"}, {status: res.status})
    
    const data: PokemonSpecies = await res.json()

    const englishFlavorTexts = data.flavor_text_entries.filter(
      (entry) => entry.language.name === "en"
    )

    const speciesData = {
      flavor_text_entries: englishFlavorTexts
    } as PokemonSpecies

    return NextResponse.json(speciesData)
  }
  catch(err) {
    console.log(err)
    return NextResponse.json({error: "Something went wrong!"}, {status: 500})
  }
}