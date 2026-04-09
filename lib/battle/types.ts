import { Prisma } from "@/app/generated/prisma/client"
import { PokemonSprites } from "@/types/pokemon"

export type BattleSide = "player" | "ai"
export type BattleEffectTarget = "self" | "target" | "both" | "field" | null
export type BattleStatus = "burn" | "poison" | "badly_poison" | "paralysis" | "sleep" | "freeze"

export interface BattleEffect {
  code: string
  chance: number | null
  target: BattleEffectTarget
  data: Record<string, unknown> | null
}

export interface BattleStatStages {
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
  accuracy: number
  evasion: number
}

export interface BattleMove {
  id: number
  name: string
  type: string
  category: "physical" | "special" | "status"
  power: number | null
  accuracy: number | null,
  remainingPP: number | null,
  maxPP: number | null,
  priority: number | null,
  effect: string,
  description: string,
  effectCode?: string,
  effectChance?: number,
  effectTarget?: string,
  effectData?: Prisma.JsonValue,
  effectList?: BattleEffect[],
  target: string,
  contact: string
}

export interface BattlePokemon {
  id: number
  name: string
  level: number
  currentHp: number
  maxHp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
  types: string[]
  moves: BattleMove[]
  fainted: boolean
  status?: BattleStatus | null
  flinched?: boolean
  statStages?: BattleStatStages
  sprites?: PokemonSprites
}

export interface BattleTeam {
  activeIndex: number
  pokemon: BattlePokemon[]
}

export interface BattleLogEntry {
  kind: "turn" | "event" | "winner"
  message: string
  turn: number
}

export interface BattleState {
  turn: number
  player: BattleTeam
  ai: BattleTeam
  winner: BattleSide | null
  battleLog: BattleLogEntry[]
}

export interface DamageResult {
  damage: number
  wasCritical: boolean
  typeMultiplier: number
  hit: boolean
}

export type BattleAction =
  | {
      type: "move"
      side: BattleSide
      moveIndex: number
    }
  | {
      type: "switch"
      side: BattleSide
      toIndex: number
    }

export interface TurnResolution {
  state: BattleState
  events: string[]
}

export interface TurnTimelineStep {
  kind: "move" | "switch" | "forced-switch"
  side: BattleSide
  moveType?: string
  events: string[]
  state: BattleState
}

export interface TurnTimelineResolution {
  steps: TurnTimelineStep[]
  finalState: BattleState
  events: string[]
}
