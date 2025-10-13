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

        // Base stats
        hpMin: p.stats?.hp?.min ?? null,
        hpMax: p.stats?.hp?.max ?? null,
        attackMin: p.stats?.attack?.min ?? null,
        attackMax: p.stats?.attack?.max ?? null,
        defenseMin: p.stats?.defense?.min ?? null,
        defenseMax: p.stats?.defense?.max ?? null,
        spAtkMin: p.stats?.spAtk?.min ?? null,
        spAtkMax: p.stats?.spAtk?.max ?? null,
        spDefMin: p.stats?.spDef?.min ?? null,
        spDefMax: p.stats?.spDef?.max ?? null,
        speedMin: p.stats?.speed?.min ?? null,
        speedMax: p.stats?.speed?.max ?? null,
      },
    })

    // Connect or create types
    if (p.types && p.types.length) {
      for (const type of p.types) {
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
            connect: p.types.map((t: string) => ({ name: t })),
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
