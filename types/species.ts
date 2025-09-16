export interface PokemonSpecies {
  id: number,
  name: string,
  evolution_chain: {url: string},
  flavor_text_entries: FlavourText[],
  varieties: Variety[]
}

export interface FlavourText {
  flavor_text: string,
  language: {
    name: string,
    url: string
  }
}

export interface Variety {
  is_default: boolean,
  pokemon: {
    name: string,
    url: string
  }
}