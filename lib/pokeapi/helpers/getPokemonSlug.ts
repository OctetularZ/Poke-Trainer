// TO:DO - Match Pokedex entries (descriptions) to Pokemon form (last thing - form based)
// Fix infinite recursion on fetching Pokemon Evolutions
// Add moves back to Pokemon Display

export function getPokemonSlug(name: string) {
  const match = name.match(/^(.+?)\s*\((.+)\)$/);
  if (match) {
    const baseName = match[1].trim().toLowerCase().replace(/[:.%']/g, '').replace(/\s+/g, '-');;
    const formName = match[2].trim().split(/\s+/).join('-').toLowerCase().replace(/[:.%']/g, '');
    return `${baseName}-${formName}`;
  }
  return name.toLowerCase().replace(/[:.]/g, '').replace(/\s+/g, '-');
}