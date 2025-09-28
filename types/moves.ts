import { Stat } from "./stats"

export interface PokemonMove {
  move: {name: string, url: string},
  version_group_details: PokemonMoveVersion
}

export interface Move {
  id: number,
  name: string,
  accuracy: number,
  effect_chance: number,
  pp: number,
  priority: number,
  power: number,
  damage_class: {name: string, url: string},
  effect_entries: VerboseEffect[],
  flavor_text_entries: MoveFlavorText[],
  stat_changes: MoveStatChange[]
}

export interface MoveStatChange {
  change: number,
  stat: Stat
}

export interface MoveFlavorText {
  flavor_text: string,
  language: {name: string, url: string}
}

export interface VerboseEffect {
  effect: string,
  short_effect: string,
  language: {name: string, url: string}
}

export interface MoveDamageClass {
  id: number,
  name: string,
  descriptions: Description,
  names: {name: string, url: string}
}

export interface Description {
  description: string,
  language: {name: string, url: string}
}

export interface PokemonMoveVersion {
  move_learn_method: {name: string, url: string},
  version_group: {name: string, url: string},
  level_learned_at: number,
  order: number
}