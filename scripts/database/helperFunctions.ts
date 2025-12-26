// Gets the Pokemon's ID from PokeAPI to get the Pokemon's information (primarily - sprites/images) from PokeAPI too
export async function getPokeApiId(pokemonName: string, formName?: string): Promise<number | null> {
  try {
    // PokeAPI format (base name + form name) i.e.: "pikachu" + "alolan" → "pikachu-alola"
    const baseSlug = pokemonName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/♂/g, '-m')
    .replace(/♀/g, '-f')
    .replace(/[.':]/g, '')
    .replace(/\s+/g, '-');

    // Common Form Names and unique cases mapped for PokeAPI
    const specialFormsMap: Record<string, string | null> = {
      'own tempo rockruff': 'own-tempo',
      'low key form': 'low-key',
      'full belly mode': 'full-belly',
      'hoopa confined': null,
      'hero of many battles': null,
      'single strike style': 'single-strike',
      'rapid strike style': 'rapid-strike',
      'family of four': 'family-of-four',
      'family of three': 'family-of-three',
      'green plumage': 'green-plumage',
      'blue plumage': 'blue-plumage',
      'white plumage': 'white-plumage',
      'yellow plumage': 'yellow-plumage',
      'chest form': null,
      'teal mask': null,
      'wellspring mask': 'wellspring-mask',
      'hearthflame mask': 'hearthflame-mask',
      'cornerstone mask': 'cornerstone-mask',
      'normal form': 'normal-form',
      'meteor form': 'red-meteor',
      'core form': 'red',
      'galarian standard mode': 'galar-standard',
      'galarian zen mode': 'galar-zen',
      'mega mewtwo x': 'mega-x',
      'mega mewtwo y': 'mega-y',
      'mega charizard x': 'mega-x',
      'mega charizard y': 'mega-y',
      'combat breed': 'paldea-combat-breed',
      'blaze breed': 'paldea-blaze-breed',
      'aqua breed': 'paldea-aqua-breed',
    };
    
    // Common Form Names and unique cases mapped for PokeAPI
    const formMap: Record<string, string | null> = {
      'alolan': 'alola',
      'hisuian': 'hisui',
      'galarian': 'galar',
      'paldean': 'paldea',
      'gigantamax': 'gmax',
      'partner': null,
      'mega': 'mega',
      'ash-greninja': 'ash',
    };

    const slugExceptions = ['burmy-sandy', 'burmy-trash']
    
    let form = formName ? (specialFormsMap[formName.toLowerCase()] ?? formName.trim().replace(/[%']/g, '').split(/\s+/)[0]) : null

    const formSlug = form ? (formMap[form.toLowerCase()] ?? form.toLowerCase().replace(/\s+/g, '-')) : null;
    
    let slug = formSlug ? `${baseSlug}-${formSlug}` : baseSlug;
    
    // Special case: burmy-plant should use base burmy endpoint
    if (slug === 'burmy-plant') slug = 'burmy';
    
    // Fetch Pokemon from PokeAPI
    const res = slugExceptions.includes(slug) ? await fetch(`https://pokeapi.co/api/v2/pokemon-form/${slug}`) : await fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`);
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.id;
  } catch (err) {
    console.warn(`⚠️ Failed to fetch PokeAPI ID for ${pokemonName} (${formName}):`, err);
    return null;
  }
}

// Note to self: Burmy is a special case and must be looked up via pokemon-form url. 
// Plant is the base form and can be looked with just 'burmy' with the original pokemon url