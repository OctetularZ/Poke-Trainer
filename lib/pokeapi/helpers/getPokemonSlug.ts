// Creates a slug for the Pokémon which is used to uniquely identify them and search PokéAPI

export function getPokemonSlug(name: string) {
  const match = name.match(/^(.+?)\s*\((.+)\)$/);
  if (match) {
    const baseName = match[1].trim().toLowerCase().replace(/[:.%']/g, '').replace(/\s+/g, '-');;
    const formName = match[2].trim().split(/\s+/).join('-').toLowerCase().replace(/[:.%']/g, '');
    return `${baseName}-${formName}`;
  }
  return name.toLowerCase().replace(/[:.]/g, '').replace(/\s+/g, '-');
}