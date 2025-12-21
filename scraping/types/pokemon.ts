// export interface Pokemon {
//   nationalNumber: string,
//   name: string,
//   species?: string,
//   height?: string,
//   weight?: string,
//   evYield?: string,
//   catchRate?: string,
//   baseFriendship?: string,
//   baseExp?: string,
//   growthRate?: string,
//   gender?: string
//   eggCycles?: string,

//   // Base stats
//   hpMin?: number
//   hpMax?: number
//   attackMin?: number
//   attackMax?: number
//   defenseMin?: number
//   defenseMax?: number
//   spAtkMin?: number
//   spAtkMax?: number
//   spDefMin?: number
//   spDefMax?: number
//   speedMin?: number
//   speedMax?: number
// }

export interface ScrapedPokemon {
  Name: string,
  Forms: string[],
  Moves: Movesets,
  'Type Chart': TypeChart,
  'National №': string,
  Type: string[],
  Species: string,
  Height: string,
  Weight: string,
  Abilities: string[],
  'EV yield': string,
  'Catch Rate': string,
  'Base Friendship': string,
  'Base Exp.': string,
  'Growth Rate': string,
  'Egg Groups': string[],
  Gender: string,
  'Egg cycles': string,

  // Stats
  HP: string[],
  Attack: string[],
  Defense: string[],
  'Sp. Atk': string[],
  'Sp. Def': string[],
  Speed: string[],

  [extraKeys: string]:
    | string
    | string[]
    | Record<string, any>
    | undefined;
}

export interface Movesets {
  [gameVersion: string]: MoveCategories;
}

export interface MoveCategories {
  // e.g. "Moves learnt by TM": RawMove[]
  [method: string]: BaseMove[];
}

export interface BaseMove {
  'Lv.'?: string,
  'TM'?: string,
  'Move': string,
  'Type': string,
  'Cat.': string,
  'Power': string,
  'Acc.': string
}

export interface TypeChart {
  Normal?: string,
  Fire?: string,
  Water?: string,
  Electric?: string,
  Grass?: string,
  Ice?: string,
  Fighting?: string,
  Poison?: string,
  Ground?: string,
  Flying?: string,
  Psychic?: string,
  Bug?: string,
  Rock?: string,
  Ghost?: string,
  Dragon?: string,
  Dark?: string,
  Steel?: string,
  Fairy?: string,
}