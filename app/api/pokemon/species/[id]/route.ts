import { NextRequest, NextResponse } from "next/server";
import { getPokemonSpecies } from "@/lib/pokeapi/species";

interface SpeciesRouteProps {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, {params}: SpeciesRouteProps) {
  const { id } = await params;

  try {
    const speciesData = await getPokemonSpecies(id);
    return NextResponse.json(speciesData);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Something went wrong!" },
      { status: 500 }
    );
  }
}