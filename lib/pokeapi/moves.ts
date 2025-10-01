import { Move, PokemonMove } from "@/types/moves";

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
        type: data.type
      } as Move;
    });
  
    return Promise.all(promises);
}