import { Type } from "./pokemonBasic"

export interface TypeInfo {
  damage_relations: {
    double_damage_from: Type[],
    double_damage_to: Type[],
    half_damage_from: Type[],
    half_damage_to: Type[],
    no_damage_from: Type[],
    no_damage_to: Type[],
  }
}