import 'dotenv/config'
import { ScrapedMove } from "@/scraping/types/move.js";
import { directPrisma as prisma } from "../../lib/prisma.js";
import { getMoveDetails } from '../../scraping/moveData.js'
import { mapMoveEffect } from './effectMapper.js'
import type { Prisma } from '../../app/generated/prisma/client'
import {
  loadShowdownMovesIndex,
  mapShowdownMoveEffects,
  toMoveId,
} from './showdownEffectMapper.js'

const moveData: ScrapedMove[] = await getMoveDetails();

const nullableFromDash = (value: string | null | undefined) => {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed === '—' || trimmed === "-" || trimmed === '' ? null : trimmed;
};

async function main() {
  const showdownIndex = await loadShowdownMovesIndex()
  let mappedCount = 0
  let showdownMappedCount = 0
  let fallbackMappedCount = 0

  for (const m of moveData) {
    const showdownMove = showdownIndex.get(toMoveId(m.Name))
    const mappedFromShowdown = showdownMove ? mapShowdownMoveEffects(showdownMove) : null

    const mapped = mappedFromShowdown?.mapped
      ? mappedFromShowdown
      : mapMoveEffect(m.Effect ?? m.Description)

    const effectList = mappedFromShowdown?.mapped
      ? (mappedFromShowdown.effectList as unknown as Prisma.InputJsonValue)
      : mapped.mapped
        ? ([
            {
              code: mapped.effectCode,
              chance: mapped.effectChance,
              target: mapped.effectTarget,
              data: mapped.effectData,
            },
          ] as unknown as Prisma.InputJsonValue)
        : undefined

    const mappedEffectData = mapped.effectData as Prisma.InputJsonValue | null

    if (mapped.mapped) {
      mappedCount += 1

      if (mappedFromShowdown?.mapped) {
        showdownMappedCount += 1
      } else {
        fallbackMappedCount += 1
      }
    }

    // Uploads every scraped Pokémon to the database depending on what information I want to add or update in DB.
    // This file changes a lot for whatever I want to update or add to the database so it is not worth commenting but this is the general idea
    await prisma.move.upsert({
      where: { name: m.Name },
      update: {
        effectCode: mapped.effectCode,
        effectChance: mapped.effectChance,
        effectTarget: mapped.effectTarget,
        effectData: mappedEffectData ?? undefined,
        effectList,
      },
      create: {
        name: m.Name,
        type: m.Type,
        category: m.Category,
        power: nullableFromDash(m.Power),
        accuracy: nullableFromDash(m.Accuracy),
        pp: nullableFromDash(m.PP),
        description: m.Description,
        priority: nullableFromDash(m.Priority),
        effect: m.Effect,
        effectCode: mapped.effectCode,
        effectChance: mapped.effectChance,
        effectTarget: mapped.effectTarget,
        effectData: mappedEffectData ?? undefined,
        effectList,
        target: m.Target,
        contact: m['Makes contact?']
      }
    })
    console.log(`✅ Seeded ${m.Name}`)
  }

  console.log(`Mapped effects for ${mappedCount}/${moveData.length} moves`)
  console.log(`Showdown mapped: ${showdownMappedCount}`)
  console.log(`Text fallback mapped: ${fallbackMappedCount}`)
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