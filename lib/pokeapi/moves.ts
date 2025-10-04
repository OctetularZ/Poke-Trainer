import { Move, PokemonMove } from "@/types/moves";
import { getMoveMachines } from "./machines";

export async function getPokemonMoves(pokemonMoves: PokemonMove[]): Promise<Move[]> {
  const scarletVioletMoves = pokemonMoves.filter((move) =>
    move.version_group_details.some(
      (version) => version.version_group.name === "scarlet-violet"
    )
  );

  const promises = scarletVioletMoves.map(async (move) => {
      const res = await fetch(move.move.url);
  
      if (!res.ok) {
        throw new Error(`Could not fetch Move: ${move.move.name}`);
      }
      
      const data = await res.json();

      const machines = await getMoveMachines(data.machines)

      return {
        id: data.id,
        name: data.name,
        accuracy: data.accuracy,
        effect_chance: data.effect_chance,
        pp: data.pp,
        priority: data.priority,
        power: data.power,
        damage_class: data.damage_class,
        effect_entries: data.effect_entries,
        flavor_text_entries: data.flavor_text_entries,
        stat_changes: data.stat_changes,
        type: data.type,
        move_learn_method: move.version_group_details,
        machines: machines
      } as Move;
    });
  
    return Promise.all(promises);
}