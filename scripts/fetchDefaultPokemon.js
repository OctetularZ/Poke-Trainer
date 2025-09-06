import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "pokemon-names.json");

async function fetchDefaultPokemon() {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1300");
    const data = await res.json();

    const detailPromises = data.results.map(async (pokemon) => {
      const pokemonRes = await fetch(pokemon.url);
      const pokemonData = await pokemonRes.json();
      return pokemonData.is_default ? pokemonData.name : null;
    });

    const names = await Promise.all(detailPromises);
    const defaultPokemonNames = names.filter(Boolean);

    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultPokemonNames, null, 2));

    console.log(`Saved ${defaultPokemonNames.length} Pokémon to ${DATA_FILE}`);
  } catch (err) {
    console.error(err);
  }
}

fetchDefaultPokemon();
