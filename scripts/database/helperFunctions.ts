// Gets the Pokemon's ID from PokeAPI to get the Pokemon's information (primarily - sprites/images) from PokeAPI too
export async function getPokeApiId(pokemonName: string, formName?: string): Promise<number | null> {
  try {
    // PokeAPI format (base name + form name) i.e.: "pikachu" + "alolan" → "pikachu-alola"
    const baseSlug = pokemonName.toLowerCase().replace(/\s+/g, '-');
    
    // Common Form Names mapped for PokeAPI
    const formMap: Record<string, string> = {
      'alolan': 'alola',
      'hisuian': 'hisui',
      'galarian': 'galar',
      'gigantamax': 'gmax',
      'mega': 'mega',
    };
    
    let form = formName ? formName.trim().split(/\s+/)[0] : null

    const formSlug = form ? formMap[form.toLowerCase()] : null;
    
    const slug = formSlug ? `${baseSlug}-${formSlug}` : baseSlug;
    
    // Fetch Pokemon from PokeAPI
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`);
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.id;
  } catch (err) {
    console.warn(`⚠️ Failed to fetch PokeAPI ID for ${pokemonName} (${formName}):`, err);
    return null;
  }
}