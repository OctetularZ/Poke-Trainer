import { Movesets, ScrapedPokemon } from "@/scraping/types/pokemon.js";
import prisma from "../../lib/prisma.js";
import { getPokemonDetails } from '../../scraping/pokemonData.js'

const pokemonData: ScrapedPokemon[] = await getPokemonDetails();

async function main() {
  for (const p of pokemonData) {
    // Upsert base Pokémon info
    const pokemon = await prisma.pokemon.upsert({
      where: { name: p.Name },
      update: {},
      create: {
        nationalNumber: p['National №'],
        name: p.Name,
        species: p.Species,
        height: p.Height,
        weight: p.Weight,
        evYield: p["EV yield"],
        catchRate: p["Catch Rate"],
        baseFriendship: p["Base Friendship"],
        baseExp: p["Base Exp."],
        growthRate: p["Growth Rate"],
        gender: p.Gender,
        eggCycles: p["Egg cycles"],

        // Stats
        hpBase: parseInt(p.HP[0]) ?? null,
        hpMin: parseInt(p.HP[1]) ?? null,
        hpMax: parseInt(p.HP[2]) ?? null,
        attackBase: parseInt(p.Attack[0]) ?? null,
        attackMin: parseInt(p.Attack[1]) ?? null,
        attackMax: parseInt(p.Attack[2]) ?? null,
        defenseBase: parseInt(p.Defense[0]) ?? null,
        defenseMin: parseInt(p.Defense[1]) ?? null,
        defenseMax: parseInt(p.Defense[2]) ?? null,
        spAtkBase: parseInt(p["Sp. Atk"][0]) ?? null,
        spAtkMin: parseInt(p["Sp. Atk"][1]) ?? null,
        spAtkMax: parseInt(p["Sp. Atk"][2]) ?? null,
        spDefBase: parseInt(p["Sp. Def"][0]) ?? null,
        spDefMin: parseInt(p["Sp. Def"][1]) ?? null,
        spDefMax: parseInt(p["Sp. Def"][2]) ?? null,
        speedBase: parseInt(p.Speed[0]) ?? null,
        speedMin: parseInt(p.Speed[1]) ?? null,
        speedMax: parseInt(p.Speed[2]) ?? null,
      },
    })

    // Types
    if (p.Type && p.Type.length) {
      const types = Array.isArray(p.Type) ? p.Type : [p.Type];
      
      // Parallel upserts - faster than linear
      await Promise.all(
        types.map(type =>
          prisma.pokemonType.upsert({
            where: { name: type },
            update: {},
            create: { name: type },
          })
        )
      );
      
      // Connect - Create link between type table and pokemon table
      await prisma.pokemon.update({
        where: { id: pokemon.id },
        data: {
          types: {
            set: [],
            connect: types.map(type => ({ name: type })),
          },
        },
      });
    }

    // Abilities
    if (p.Abilities && p.Abilities.length) {
      const abilities = Array.isArray(p.Abilities) ? p.Abilities : [p.Abilities];
      
      // Parallel upserts
      await Promise.all(
        abilities.map(ability =>
          prisma.pokemonAbility.upsert({
            where: { name: ability },
            update: {},
            create: { name: ability },
          })
        )
      );
      
      // Connect
      await prisma.pokemon.update({
        where: { id: pokemon.id },
        data: {
          abilities: {
            set: [],
            connect: abilities.map(ability => ({ name: ability })),
          },
        },
      });
    }

    // Egg Groups
    if (p["Egg Groups"] && p["Egg Groups"].length) {
      const eggGroups = Array.isArray(p["Egg Groups"]) ? p["Egg Groups"] : [p["Egg Groups"]];
      
      // Parallel upserts
      await Promise.all(
        eggGroups.map(eggGroup =>
          prisma.eggGroup.upsert({
            where: { name: eggGroup },
            update: {},
            create: { name: eggGroup },
          })
        )
      );
      
      // Connect
      await prisma.pokemon.update({
        where: { id: pokemon.id },
        data: {
          eggGroups: {
            set: [],
            connect: eggGroups.map(eggGroup => ({ name: eggGroup })),
          },
        },
      });
    }

    // if (p.SoulSilver) {
    //   await prisma.
    // }

    const moveSets = p.Moves as Movesets

    if (moveSets) {
    // p.Moves is: { [gameName: string]: { [method: string]: Move[] } }

    for (const [gameName, moveCategories] of Object.entries(moveSets)) {

      for (const [method, moves] of Object.entries(moveCategories)) {
        const moves = moveCategories[method];

        // Skip incorrect move formats, it should always be a list
        if (!Array.isArray(moves)) continue;

        for (const move of moves) {
          const moveRecord = await prisma.move.upsert({
            where: { name: move.Move },
            update: {},
            create: {
              name: move.Move,
              type: move.Type,
              category: move["Cat."],
              power: move.Power === "—" ? null : move.Power,
              accuracy: move["Acc."] === "—" ? null : move["Acc."],
            },
          });

          await prisma.gameMove.create({
            data: {
              method, // e.g. "Moves learnt by TM"
              level: move["Lv."]?.toString() ?? null,
              tmNumber: move.TM ?? null,
              pokemon: { connect: { id: pokemon.id } },
              move: { connect: { id: moveRecord.id } },
              game: {
                connectOrCreate: {
                  where: { name: gameName },
                  create: { name: gameName },
                },
              },
            },
          });
        }
      }
    }
  }



    console.log(`✅ Seeded ${p.Name}`)
  }
}

main()
  .then(async () => {
    console.log('🌱 Seed complete!')
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
