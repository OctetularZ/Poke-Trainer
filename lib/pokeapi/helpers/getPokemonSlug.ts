// TO:DO - Make exceptions for Pokemon base names with spaces and dashes
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

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

export function getPokemonName(slug: string) {
  // Reverse of getPokemonSlug: baseName-formName1-formName2 => BaseName (Form Name1 Form Name2)
  const parts = slug.split('-');
  if (parts.length > 1) {
    const baseName = capitalizeWords(parts[0]);
    const formName = parts.slice(1).map(capitalizeWords).join(' ');
    return `${baseName} (${formName})`;
  }
  return capitalizeWords(slug);
}