import 'dotenv/config'
import { ScrapedMove } from "@/scraping/types/move.js";
import { directPrisma as prisma } from "../../lib/prisma.js";
import { getMoveDetails } from '../../scraping/moveData.js'

const pokemonData: ScrapedMove[] = await getMoveDetails();