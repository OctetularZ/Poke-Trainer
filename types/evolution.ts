export interface EvolutionTree {
  id: number,
  name: string,
  evolutions: Evolution[]
}

export interface Evolution {
  method: string,
  pokemon: EvolutionTree
}