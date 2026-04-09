// import { Machine } from "./machine"
// import { PokemonStats } from "./stats"
import type { Prisma } from "@/app/generated/prisma/client"
import { Game } from "./game"

export interface GameMove {
  id: number,
  method: string,
  level?: string,
  tmNumber?: string,
  move?: Move,
  game?: Game
}

export interface Move {
  id: number,
  name: string,
  type: string,
  category: string,
  power: string | null,
  accuracy: string | null,
  pp?: string | null,
  description?: string,
  priority?: string | null,
  effect?: string,
  effectCode?: string,
  effectChance?: number,
  effectTarget?: string,
  effectData?: Prisma.JsonValue,
  effectList?: Prisma.JsonValue,
  target?: string | null,
  contact?: string | null
}