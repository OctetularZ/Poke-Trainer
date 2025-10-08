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

    const name = formName ? formName : baseName

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
  const formTabs = $(".tabset-basics .sv-tabs-tab-list a")
  formTabs.each((_, element) => {
    let formName = $(element).text().trim();
    if (formName === name) {
      formId = $(element).attr("href").slice(1)
    }
    forms.push(formName)
  })
  details["Forms"] = forms

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
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map(fn));
    results.push(...batchResults);
    console.log(`✅ Processed batch ${i / batchSize + 1} of ${Math.ceil(items.length / batchSize)}`);
  }
  return results;
}

(async () => {
  console.log("Fetching Pokémon list...");
  const pokemonList = await getPokemonList();
  console.log(`Found ${pokemonList.length} Pokémon.`);

  const batchSize = 15;

  console.log(`Scraping Pokémon details in batches of ${batchSize}...`);
  const results = await batchProcess(pokemonList, batchSize, async (pokemon) => {
    try {
      const details = await scrapePokemonDetails(pokemon.name ,pokemon.link);
      return { name: pokemon.name, ...details };
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
  console.log(successful.slice(0, 10)); // show first 10 examples

  // TODO: save to your PostgreSQL DB using Prisma here
})();