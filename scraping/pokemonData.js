import axios from "./axiosInstance.js"
import * as cheerio from "cheerio";

const url = "https://pokemondb.net/pokedex/all"

export async function getPokemonList() {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const pokemon = [];

  $("table#pokedex tbody tr").each((index, element) => {
    const baseName = $(element).find("td.cell-name a").text().trim();
    const formName = $(element).find("td.cell-name small").text().trim();
    const link = $(element).find("td.cell-name a").attr("href");

    const name = formName ? `${baseName} (${formName})` : baseName

    pokemon.push({
      name,
      link: "https://pokemondb.net" + link
    });
  });

  return pokemon;
}

export async function scrapePokemonDetails(name, url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const details = {};
  let formId;

  let forms = []

  const firstTabsList = $(".tabset-basics .sv-tabs-tab-list").first();
  if (!firstTabsList.hasClass("sv-tabs-grow")) {
    const formTabs = firstTabsList.find("a")
    formTabs.each((_, element) => {
      let formName = $(element).text().trim();
      if (formName === name) {
        formId = $(element).attr("href").slice(1)
      }
      forms.push(formName)
    })
  }

  details["Forms"] = forms

  let moveVersionIds = [];
  const moveVersionTabs = $(".tabset-moves-game .sv-tabs-tab-list a")
  moveVersionTabs.each((_, element) => {
    let versionName = $(element).text().trim();
    let moveVersionId = $(element).attr("href").slice(1)
    moveVersionIds.push({versionName, moveVersionId})
  })

  moveVersionIds.forEach((version, _) => {
    let moveVersion = {};
    let moves = {};

    let learnMethods = $(`#${version.moveVersionId} h3`)

    learnMethods.each((_, h3) => {
      const categoryName = $(h3).text().trim()
       // Need to check if the .next().next() of h3 has a div with class of .resp-scroll, if so, then a move table exists so there is moves in that category.
       // Table always comes after a short description of the move list
      if ($(h3).next().next().hasClass('resp-scroll')) { // There are moves for this learn method available
        let table = $(h3).next().next().find('.data-table')
        
        const headers = []
        $(table)
          .find("thead th")
          .each((_, th) => {
            headers.push($(th).find("div").text().trim())
          })
        
        const rows = $(table).find("tbody tr").map((_, tr) => {
            const moveData = {}
            $(tr).find("td").each((i, td) => {
                const key = headers[i]
                let value;
                if ($(td).find('img').length) {
                  value = $(td).find('img').attr('title') || $(td).find('img').attr('alt');
                } else if ($(td).find('a').length) {
                  value = $(td).find('a').text().trim();
                } else {
                  value = $(td).text().trim();
                }
                moveData[key] = value
              })
            return moveData
          }).get()

          moves[categoryName] = rows
      }
    })
    moveVersion[version.moveVersion] = moves

    details["Moves"] = details["Moves"] || {}
    details["Moves"][version.versionName] = moves
  })

  let types = {}
  $(`#${formId} .type-table tbody tr td`).each((_, element) => {
    const title = $(element).attr("title").split(" ")[0]
    const effectiveness = $(element).text().trim()
    types[title] = effectiveness
  })
  details["Type Chart"] = types

  // Specific Pokemon form data
  $(`#${formId} .vitals-table tbody tr`).each((index, row) => {
    let header = "";
    const head = $(row).find("th")
    if ($(head).find("span").length) {
      header = $(head).find("span").map((_, element) => $(element).text().trim()).get().join(",");
    }
    else {
      header = $(head).text().trim();
    }
    if (header === "Local №") return;

    const td = $(row).find("td")

    let values = [];

    if (td.find("a").length) {
      values = td.find("a").map((_, element) => $(element).text().replace(/\s+/g, " ").trim()).get();
    } else if (td.find("strong").length) {
      values = td.find("strong").map((_, element) => $(element).text().replace(/\s+/g, " ").trim()).get();
    } else if (td.length > 1) {
      td.each((i, element) => {
        if ($(element).hasClass("cell-barchart")) return;
        values.push($(element).text().replace(/\s+/g, " ").trim());
      });
    }
    else if (td.find("span").length > 1) {
      values = td.find("span").map((_, element) => $(element).text().replace(/\s+/g, " ").trim()).get();
    }
     else {
      values = td.text().replace(/\s+/g, " ").trim();
    }

    details[header] = values.length > 1 ? values : values[0] || "";
    });

    // Evolution Chain
    let evolutionChain = []

    $(".infocard-list-evo div.infocard").each((index, row) => {
      let fromPokemon = $(row).find(".ent-name").text().trim();

      let formName = $(row).find(".ent-name").nextAll("small").first();

      if (!($(formName).find("a").length > 0)) {
        fromPokemon = `${fromPokemon} (${formName.text().trim()})`
      }

      let nextElement = $(row).next();
      
      // Check if it's a split evolution
      if (nextElement.hasClass("infocard-evo-split")) {
        // Handle multiple branches
        nextElement.find(".infocard-evo-split-path").each((i, path) => {
          let method = $(path).find(".infocard-arrow small").text().trim().replace(/[()]/g, '');
          let toPokemon = $(path).find(".infocard .ent-name").text().trim();
          
          if (toPokemon) {
            evolutionChain.push({ from: fromPokemon, to: toPokemon, method });
          }
        });
      } 
      // Check if it's a linear evolution
      else if (nextElement.hasClass("infocard-arrow")) {
        let method = nextElement.find("small").text().trim().replace(/[()]/g, '');
        let toPokemon = nextElement.next(".infocard").find(".ent-name").text().trim();
        
        if (toPokemon) {
          evolutionChain.push({ from: fromPokemon, to: toPokemon, method });
        }
      }
    });

    details["Evolution Chain"] = evolutionChain

    // General Pokemon Data
    $(".vitals-table tbody tr").each((index, row) => {
    let header = "";
    const head = $(row).find("th")
    if ($(head).find("span").length) {
      header = $(head).find("span").map((_, element) => $(element).text().trim()).get().join(",");
    }
    else {
      header = $(head).text().trim();
    }
    if (header === "Local №") return;

    const td = $(row).find("td")

    let values = [];

    if (td.find("a").length) {
      values = td.find("a").map((_, element) => $(element).text().replace(/\s+/g, " ").trim()).get();
    } else if (td.find("strong").length) {
      values = td.find("strong").map((_, element) => $(element).text().replace(/\s+/g, " ").trim()).get();
    } else if (td.length > 1) {
      td.each((i, element) => {
        if ($(element).hasClass("cell-barchart")) return;
        values.push($(element).text().replace(/\s+/g, " ").trim());
      });
    }
    else if (td.find("span").length > 1) {
      values = td.find("span").map((_, element) => $(element).text().replace(/\s+/g, " ").trim()).get();
    }
     else {
      values = td.text().replace(/\s+/g, " ").trim();
    }

    if (details[header]) return; // Skip if form-specific data already added to ensure it's overwritten.
    details[header] = values.length > 1 ? values : values[0] || "";
    });

    return details
}


async function batchProcess(items, batchSize, fn) {
  const results = [];
  for (let i = 0; i < 50; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map(fn));
    results.push(...batchResults);
    console.log(`✅ Processed batch ${i / batchSize + 1} of ${Math.ceil(items.length / batchSize)}`);
  }
  return results;
}

export async function getPokemonDetails() {
  console.log("Fetching Pokémon list...");
  const pokemonList = await getPokemonList();
  console.log(`Found ${pokemonList.length} Pokémon.`);

  const batchSize = 15;

  console.log(`Scraping Pokémon details in batches of ${batchSize}...`);
  const results = await batchProcess(pokemonList, batchSize, async (pokemon) => {
    try {
      const details = await scrapePokemonDetails(pokemon.name ,pokemon.link);
      return { Name: pokemon.name, ...details };
    } catch (err) {
      console.error(`❌ Failed to scrape ${pokemon.name}: ${err.message}`);
      return null;
    }
  });

  // Filter out failed results
  const successful = results
    .filter((r) => r.status === "fulfilled" && r.value)
    .map((r) => r.value);

  console.log(`🎉 Scraped ${successful.length} Pokémon successfully!`);
  // console.log(successful.slice(0, 10)); // show first 10 examples
  // console.log(JSON.stringify(successful[2]["Evolution Chain"], null, 2));

  return successful
};