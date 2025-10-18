import { ScrapedPokemon } from "@/scraping/types/pokemon.js";
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

    // Connect or create types
    if (p.Type && p.Type.length) {
      for (const type of p.Type) {
        await prisma.pokemonType.upsert({
          where: { name: type },
          update: {},
          create: { name: type },
        })
      }
      // Connect them
      await prisma.pokemon.update({
        where: { id: pokemon.id },
        data: {
          types: {
            set: [],
            connect: p.Type.map((type: string) => ({ name: type })),
          },
        },
      })
    }

    // Abilities
    if (p.abilities && p.abilities.length) {
      for (const ability of p.abilities) {
        await prisma.pokemonAbility.upsert({
          where: { name: ability },
          update: {},
          create: { name: ability },
        })
      }
      await prisma.pokemon.update({
        where: { id: pokemon.id },
        data: {
          abilities: {
            set: [],
            connect: p.abilities.map((a: string) => ({ name: a })),
          },
        },
      })
    }

    // Moves
    if (p.moves) {
      for (const [method, moves] of Object.entries(p.moves)) {
        for (const move of moves as any[]) {
          const moveRecord = await prisma.move.upsert({
            where: { name: move.Move },
            update: {},
            create: {
              name: move.Move,
              type: move.Type,
              category: move['Cat.'],
              power: move.Power === '—' ? null : move.Power,
              accuracy: move.Acc === '—' ? null : move.Acc,
            },
          })

          // Create or connect GameMove
          await prisma.gameMove.create({
            data: {
              method,
              level: move.Lv?.toString() ?? null,
              tmNumber: move.TM ?? null,
              pokemon: { connect: { id: pokemon.id } },
              move: { connect: { id: moveRecord.id } },
              game: {
                connectOrCreate: {
                  where: { name: 'Scarlet/Violet' },
                  create: { name: 'Scarlet/Violet' },
                },
              },
            },
          })
        }
      }
    }

    console.log(`✅ Seeded ${p.name}`)
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
