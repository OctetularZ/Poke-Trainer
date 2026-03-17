export type BattleSide = "player" | "ai"

export interface BattleMove {
  id: number
  name: string
  type: string
  category: "physical" | "special" | "status"
  power: number | null
  accuracy: number | null
  pp?: number
  priority?: number
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
}

export interface BattleTeam {
  activeIndex: number
  pokemon: BattlePokemon[]
}

export interface BattleState {
  turn: number
  player: BattleTeam
  ai: BattleTeam
  winner: BattleSide | null
  battleLog: string[]
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
