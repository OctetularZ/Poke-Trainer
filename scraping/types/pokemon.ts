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
  Abilties: string[],
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
  [gameVersion: string]: MoveCategories[];
}

export interface MoveCategories {
  "Moves learnt by level up"?: LevelUpMove[];
  "Moves learnt on evolution"?: BaseMove[];
  "Moves learnt by TM"?: TMMove[];
  "Egg moves"?: BaseMove[];
  "Move Tutor moves"?: BaseMove[];

  // in case other categories exist (i.e. "TR moves", "Special moves")
  [category: string]: BaseMove[] | undefined;
}

export interface BaseMove {
  'Move': string,
  'Type': string,
  'Cat.': string,
  'Power': string,
  'Acc.': string
}

export interface LevelUpMove extends BaseMove {
  "Lv.": string;
}

export interface TMMove extends BaseMove {
  'TM': string;
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