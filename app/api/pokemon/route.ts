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
  const abilitiesParam = searchParams.get("abilities");

  try {
    let pokemonList: urlData[] = [];

    // Filtering logic
    if (typesParam || abilitiesParam) {
      let typeFiltered: Record<string, urlData> = {};
      let typeCounts: Record<string, number> = {};
      let abilityFiltered: Record<string, urlData> = {};
      let abilityCounts: Record<string, number> = {};

      // Type filtering
      if (typesParam) {
        const typeNames = typesParam.split(",");
        for (let type of typeNames) {
          const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
          const typeData = await typeRes.json();
          typeData.pokemon.forEach((p: TypeOfPokemon) => {
            if (!typeFiltered[p.pokemon.name]) {
              typeFiltered[p.pokemon.name] = p.pokemon;
            }
            typeCounts[p.pokemon.name] = (typeCounts[p.pokemon.name] || 0) + 1;
          });
        }
      }

      // Ability filtering
      if (abilitiesParam) {
        const abilityNames = abilitiesParam.split(",");
        for (let ability of abilityNames) {
          const abilityRes = await fetch(`https://pokeapi.co/api/v2/ability/${ability}`);
          const abilityData = await abilityRes.json();
          abilityData.pokemon.forEach((p: any) => {
            const poke = p.pokemon;
            if (!abilityFiltered[poke.name]) {
              abilityFiltered[poke.name] = poke;
            }
            abilityCounts[poke.name] = (abilityCounts[poke.name] || 0) + 1;
          });
        }
      }

      // Combine filters (intersection)
      if (typesParam && abilitiesParam) {
        const typeNames = typesParam.split(",");
        const abilityNames = abilitiesParam.split(",");
        pokemonList = Object.keys(typeFiltered)
          .filter(
            (name) =>
              typeCounts[name] === typeNames.length &&
              abilityCounts[name] === abilityNames.length
          )
          .map((name) => typeFiltered[name]);
      } else if (typesParam) {
        const typeNames = typesParam.split(",");
        pokemonList = Object.entries(typeCounts)
          .filter(([_, count]) => count === typeNames.length)
          .map(([name, _]) => typeFiltered[name]);
      } else if (abilitiesParam) {
        const abilityNames = abilitiesParam.split(",");
        pokemonList = Object.entries(abilityCounts)
          .filter(([_, count]) => count === abilityNames.length)
          .map(([name, _]) => abilityFiltered[name]);
      }
    } else {
      // Normal fetch if no filter selected
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`);
      const data = await res.json();
      pokemonList = data.results;
    }

    const paginated =
      typesParam || abilitiesParam
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