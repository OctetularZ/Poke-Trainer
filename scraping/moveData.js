import axios from "./axiosInstance.js"
import * as cheerio from "cheerio";

const url = "https://pokemondb.net/move/all"

export async function getMoveList() {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const moves = [];

  $("table#moves tbody tr").each((index, element) => {
    const moveName = $(element).find("td.cell-name a").text().trim();
    const effect = $(element).find("td.cell-long-text").text().trim();
    const link = $(element).find("td.cell-name a").attr("href");

    moves.push({
      moveName,
      effect,
      link: "https://pokemondb.net" + link
    });
  });

  return moves;
}

export async function scrapeMoveDetails(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const details = {};

  const moveData = $(".vitals-table").first().find("tr");
  moveData.each((_, element) => {
    const rowHeader = $(element).find("th").text().trim()

    const rowData = $(element).find("td")

    if (rowHeader === "Type") {
      details["Type"] = $(rowData).find("a").text().trim()
    }
    else if (rowHeader === "Category") {
      details["Category"] = $(rowData).find("img").attr("title")?.trim() || $(rowData).text().trim()
    }
    else if (rowHeader === "PP") {
      details["PP"] = $(rowData).contents().not("small").text().trim()
    }
    else {
      details[rowHeader] = $(rowData).text().trim()
    }
  })

  const moveDescription = $("h2#move-descr").next("div").find("table tbody tr").first()
  details["Description"] = $(moveDescription).find("td").text().trim()

  const moveTarget = $("div.move-target .mt-selected").first()
  details["Target"] = $(moveTarget).text().trim()

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

export async function getMoveDetails() {
  console.log("Fetching Move list...");
  const moveList = await getMoveList();
  console.log(`Found ${moveList.length} Moves.`);

  const batchSize = 15;

  console.log(`Scraping Move details in batches of ${batchSize}...`);
  const results = await batchProcess(moveList, batchSize, async (move) => {
    try {
      const details = await scrapeMoveDetails(move.link);
      const name = move.moveName
      const effect = move.effect
      return { Name: name, Effect: effect, ...details };
    } catch (err) {
      console.error(`❌ Failed to scrape ${move.moveName}: ${err.message}`);
      return null;
    }
  });

  // Filter out failed results
  const successful = results
    .filter((r) => r.status === "fulfilled" && r.value)
    .map((r) => r.value);

  console.log(`🎉 Scraped ${successful.length} Moves successfully!`);
  // Test Sample
  console.log(successful.slice(0, 20)); // show first 20 examples

  return successful
};