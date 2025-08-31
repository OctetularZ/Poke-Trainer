import { NextRequest, NextResponse } from "next/server";

interface urlData {
  name: string;
  url: string;
}

export interface PokemonBasic {
  id: number;
  name: string;
  types: PokemonType[];
  sprites: { front_default: string; back_default: string };
  showdown: { front_default: string; back_default: string };
  officialArtwork: {front_default: string}
}

export interface PokemonType {
  slot: number;
  type: Type;
}

export interface Type {
  name: string;
  url: string;
}

export interface TypeOfPokemon {
  slot: number;
  pokemon: urlData;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "12", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const typesParam = searchParams.get("types");

  const filteredPokemons: Record<string, PokemonBasic> = {};
  const pokemonCounts: Record<string, number> = {};

  try {
    let pokemonList: urlData[] = [];

    if (typesParam) {
      const typeNames = typesParam.split(",");
      let filteredPokemons: Record<string, urlData> = {};

      for (let type of typeNames) {
        const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        const typeData = await typeRes.json();
        
        typeData.pokemon.forEach((p: TypeOfPokemon) => {
          if (!filteredPokemons[p.pokemon.name]) {
            filteredPokemons[p.pokemon.name] = p.pokemon;
          }

          pokemonCounts[p.pokemon.name] = (pokemonCounts[p.pokemon.name] || 0) + 1;
        });
      }

      pokemonList = Object.entries(pokemonCounts)
        .filter(([_, count]) => count === typeNames.length)
        .map(([name, _]) => filteredPokemons[name]);
    } else {
      // Normal fetch if not filter selected
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`);
      const data = await res.json();
      pokemonList = data.results;
    }

    const paginated = typesParam 
      ? pokemonList.slice(offset, offset + limit)
      : pokemonList;

    const detailedPromises = paginated.map(async (p: urlData) => {
      const res = await fetch(p.url);
      const data = await res.json();

      return {
        id: data.id,
        name: data.name,
        types: data.types,
        sprites: {
          front_default: data.sprites.front_default ?? "",
          back_default: data.sprites.back_default ?? "",
        },
        showdown: {
          front_default: data.sprites.other?.showdown?.front_default ?? "",
          back_default: data.sprites.other?.showdown?.back_default ?? "",
        },
        officialArtwork: data.sprites.other?.['official-artwork']?.front_default ?? ""
      } as PokemonBasic;
    });

    const pokemonData = await Promise.all(detailedPromises);

    return NextResponse.json(pokemonData);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}