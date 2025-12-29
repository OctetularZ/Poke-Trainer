// import { Machine } from "./machine"
// import { PokemonStats } from "./stats"
import { Game } from "./game"

export interface GameMove {
  method: string,
  level?: string,
  tmNumber?: string,
  move?: Move,
  game?: Game
}

export interface Move {
  name: string,
  type: string,
  category: string,
  power: string,
  accuracy: string
}