export interface PokemonStat {
  stat: Stat,
  effort: number,
  base_stat: number
}

export interface Stat {
  id: number,
  name: string,
  is_battle_only: boolean
}