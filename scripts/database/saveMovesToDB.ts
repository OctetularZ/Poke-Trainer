import 'dotenv/config'
import { ScrapedMove } from "@/scraping/types/move.js";
import { directPrisma as prisma } from "../../lib/prisma.js";
import { getMoveDetails } from '../../scraping/moveData.js'

const moveData: ScrapedMove[] = await getMoveDetails();

const nullableFromDash = (value: string | null | undefined) => {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed === '-' || trimmed === '' ? null : trimmed;
};

async function main() {
  for (const m of moveData) {
    const move = await prisma.move.upsert({
      where: { name: m.Name },
      update: {
        pp: nullableFromDash(m.PP),
        effect: m.Effect,
        priority: nullableFromDash(m.Priority),
        description: m.Description,
        target: m.Target
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
        target: m.Target
      }
    })
    console.log(`✅ Seeded ${m.Name}`)
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