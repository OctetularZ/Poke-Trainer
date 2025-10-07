import axios from "./axiosInstance.js"
import * as cheerio from "cheerio";


const url = "https://pokemondb.net/pokedex/all"

export async function getPokemonList() {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const pokemon = [];

  $("table#pokedex tbody tr").each((index, element) => {
    const name = $(element).find("td.cell-name a").text();
    const link = $(element).find("td.cell-name a").attr("href");
    pokemon.push({
      name,
      link: "https://pokemondb.net" + link
    });
  });

  return pokemon;
}

export async function scrapePokemonDetails(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const details = {};

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

    details[header] = values.length > 1 ? values : values[0] || "";
    });

    return details
}

(async () => {
  const details = await scrapePokemonDetails(
    "https://pokemondb.net/pokedex/bulbasaur"
  );
  console.log(details);
})();
