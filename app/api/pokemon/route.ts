import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

interface urlData {
  name: string;
  url: string;
}

export interface PokemonBasic {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    back_default: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    // GET request to PokeAPI
    const res = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=10', {next: {revalidate: 3600}});

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch Pokémon data!' }, { status: res.status });
    }

    const urlData = await res.json();
    const results = urlData.results;

    // Fetch full data for each Pokemon
    const detailedPromises = results.map(async (pokemon: urlData) => {
      const res = await fetch(pokemon.url);
      const data = await res.json();

      if (!res.ok) {
        return NextResponse.json({error: `Failed to fetch data for ${pokemon.name}`}, {status: res.status})
      }

      const filtered: PokemonBasic = {
          id: data.id,
          name: data.name,
          sprites: {
            front_default: data.sprites.front_default,
            back_default: data.sprites.back_default,
          }
        };
        return filtered;
    });

    const pokemonData = await Promise.all(detailedPromises);

    return NextResponse.json(pokemonData);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong!' }, { status: 500 });
  }
}