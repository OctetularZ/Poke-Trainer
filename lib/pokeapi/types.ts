import { PokemonType } from "@/types/pokemonBasic";
import { TypeInfo } from "@/types/type";

export async function getPokemonTypesInformation(types: PokemonType[]): Promise<TypeInfo[]> {
const promises = types.map(async (type) => {
    const res = await fetch(type.type.url);

    if (!res.ok) {
      throw new Error(`Could not fetch information of type: ${type.type.name}`);
    }

    const data = await res.json();
    return {
      damage_relations: data.damage_relations
    } as TypeInfo;
  });

  return Promise.all(promises);
}