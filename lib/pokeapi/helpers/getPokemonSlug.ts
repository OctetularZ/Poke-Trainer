export function getPokemonSlug(name: string) {
  const match = name.match(/^(.+?)\s*\((.+)\)$/);
  if (match) {
    const baseName = match[1].trim();
    const formName = match[2].trim().split(/\s+/).join('-');
    return `${baseName}-${formName}`;
  }
  return name;
}

export function getPokemonName(slug: string) {
  const parts = slug.split('-');
  if (parts.length > 1) {
    const baseName = parts[0];
    const formName = parts.slice(1).join(' ');
    return `${baseName} (${formName})`;
  }
  return slug;
}