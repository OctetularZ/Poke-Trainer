import 'dotenv/config'
import { Movesets, ScrapedPokemon } from "@/scraping/types/pokemon.js";
import { directPrisma as prisma } from "../../lib/prisma.js";
import { getPokemonDetails } from '../../scraping/pokemonData.js'

const pokemonData: ScrapedPokemon[] = await getPokemonDetails();

const knownKeys = new Set([
    'Name', 'Forms', 'Moves', 'Type Chart', 'National №', 'Type', 'Species',
    'Height', 'Weight', 'Abilities', 'EV yield', 'Catch rate', 'Base Friendship',
    'Base Exp.', 'Growth Rate', 'Egg Groups', 'Gender', 'Egg cycles',
    'HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed',
    'English', 'Japanese', 'German', 'French', 'Italian', 'Spanish', 'Korean',
    'Chinese (Simplified)', 'Chinese (Traditional)'
  ]);

async function main() {
  for (const p of pokemonData) {
    // Upsert base Pokémon info
    const pokemon = await prisma.pokemon.upsert({
      where: { name: p.Name },
      update: {},
      create: {

        // General info
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

    // Moves
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

    // Game Decriptions
    const gameDescriptions = Object.entries(p)
    .filter(([key, value]) => 
      !knownKeys.has(key) && 
      typeof value === 'string' &&
      value.length > 0
    );

    if (gameDescriptions.length > 0) {
      await Promise.all(
        gameDescriptions.map(([game, description]) =>
          prisma.gameDescription.upsert({
            where: { 
              pokemonId_game: { pokemonId: pokemon.id, game } 
            },
            update: { description: description as string },
            create: { 
              game, 
              description: description as string,
              pokemon: { connect: { id: pokemon.id } }
            },
          })
        )
      );
    }

    // Translations
    const translationData = [
      { language: 'English', translatedName: p.English },
      { language: 'Japanese', translatedName: p.Japanese },
      { language: 'German', translatedName: p.German },
      { language: 'French', translatedName: p.French },
      { language: 'Italian', translatedName: p.Italian },
      { language: 'Spanish', translatedName: p.Spanish },
      { language: 'Korean', translatedName: p.Korean },
      { language: 'Chinese (Simplified)', translatedName: p['Chinese (Simplified)'] },
      { language: 'Chinese (Traditional)', translatedName: p['Chinese (Traditional)'] },
    ].filter(t => t.translatedName && typeof t.translatedName === 'string');

    if (translationData.length > 0) {
      await Promise.all(
        translationData.map(({ language, translatedName }) =>
          prisma.pokemonTranslation.upsert({
            where: {
              pokemonId_language: { pokemonId: pokemon.id, language }
            },
            update: { translatedName },
            create: {
              language,
              translatedName,
              pokemon: { connect: { id: pokemon.id } }
            },
          })
        )
      );
    }

    // Forms
    if (p.Forms && p.Forms.length) {
      await Promise.all(
        p.Forms.map(form =>
          prisma.pokemonForm.upsert({
            where: {
              pokemonId_name: { pokemonId: pokemon.id, name: form }
            },
            update: {},
            create: {
              name: form,
              pokemon: { connect: { id: pokemon.id } }
            },
          })
        )
      );
    }

    // Type Effectiveness
    if (p['Type Chart']) {
      const typeChart = Object.entries(p['Type Chart'])
        .filter(([type, multiplier]) => multiplier && multiplier.length > 0);

      if (typeChart.length > 0) {
        await Promise.all(
          typeChart.map(([attackType, multiplier]) =>
            prisma.typeEffectiveness.upsert({
              where: {
                pokemonId_attackType: { pokemonId: pokemon.id, attackType }
              },
              update: { multiplier: multiplier as string },
              create: {
                attackType,
                multiplier: multiplier as string,
                pokemon: { connect: { id: pokemon.id } }
              },
            })
          )
        );
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


// Adding Pokemon in parralel logic - will add when finished with main adding Pokemon to DB logic

// async function main() {
//   const batchSize = 3; // Conservative for free tier
  
//   for (let i = 0; i < pokemonData.length; i += batchSize) {
//     const batch = pokemonData.slice(i, i + batchSize);
    
//     await Promise.all(batch.map(async (p) => {
//       // Your entire Pokemon processing logic
//       const pokemon = await prisma.pokemon.upsert({...});
//       // ... rest of logic
//       console.log(`✅ Seeded ${p.Name}`);
//     }));
//   }