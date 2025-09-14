export interface PokemonSpecies {
  id: number,
  name: string,
  evolution_chain: {url: string}
  flavor_text_entries: FlavourText[]
}

export interface FlavourText {
  flavor_text: string,
  language: {
    name: string,
    url: string
  }
}