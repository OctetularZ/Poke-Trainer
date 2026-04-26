import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "pokemon-names.json");

/* 
 * Fetches Pokémon data from the PokéAPI, filters out non-default forms,
 * and saves the resulting names locally for use by the application.
 *
 * This prevents repeated API calls at runtime and provides a consistent
 * dataset for search/autocomplete functionality.
*/

async function fetchDefaultPokemon() {
  try {
    // Limit is high enough to fetch all Pokémon from pokeapi
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1300");
    const data = await res.json();

    // Detailed requests are needed because the initial list does not include is_default.
    const detailPromises = data.results.map(async (pokemon) => {
      const pokemonRes = await fetch(pokemon.url);
      const pokemonData = await pokemonRes.json();

      // Exclude alternate forms
      return pokemonData.is_default ? pokemonData.name : null;
    });

    // Runs promises in parallel to reduce fetch time
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
