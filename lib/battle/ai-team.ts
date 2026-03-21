import { BattlePokemon } from "./types"

function createPokemon(
  pokemon: Partial<BattlePokemon> & Pick<BattlePokemon, "id" | "name">,
): BattlePokemon {
  return {
    id: pokemon.id,
    name: pokemon.name,
    level: pokemon.level ?? 100,
    currentHp: pokemon.currentHp ?? 160,
    maxHp: pokemon.maxHp ?? 160,
    attack: pokemon.attack ?? 120,
    defense: pokemon.defense ?? 100,
    specialAttack: pokemon.specialAttack ?? 120,
    specialDefense: pokemon.specialDefense ?? 100,
    speed: pokemon.speed ?? 100,
    types: pokemon.types ?? ["normal"],
    moves: pokemon.moves ?? [],
    fainted: pokemon.fainted ?? false,
    sprites: pokemon.sprites,
  }
}

export function buildDefaultAiTeam(): BattlePokemon[] {
  return [
    createPokemon({
      id: 25,
      name: "Pikachu",
      types: ["electric"],
      maxHp: 140,
      currentHp: 140,
      speed: 130,
      sprites: {other: {showdown: {front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/25.gif"}}},
      moves: [
        {
          id: 9,
          name: "Thunderbolt",
          type: "electric",
          category: "special",
          power: 90,
          accuracy: 100,
        },
        {
          id: 10,
          name: "Quick Attack",
          type: "normal",
          category: "physical",
          power: 40,
          accuracy: 100,
          priority: 1,
        },
        {
          id: 11,
          name: "Iron Tail",
          type: "steel",
          category: "physical",
          power: 100,
          accuracy: 75,
        },
        {
          id: 12,
          name: "Electro Ball",
          type: "electric",
          category: "special",
          power: 80,
          accuracy: 100,
        },
      ],
    }),
    createPokemon({
      id: 3,
      name: "Venusaur",
      types: ["grass", "poison"],
      maxHp: 180,
      currentHp: 180,
      defense: 115,
      moves: [
        {
          id: 13,
          name: "Energy Ball",
          type: "grass",
          category: "special",
          power: 90,
          accuracy: 100,
        },
        {
          id: 14,
          name: "Sludge Bomb",
          type: "poison",
          category: "special",
          power: 90,
          accuracy: 100,
        },
        {
          id: 15,
          name: "Earthquake",
          type: "ground",
          category: "physical",
          power: 100,
          accuracy: 100,
        },
        {
          id: 16,
          name: "Vine Whip",
          type: "grass",
          category: "physical",
          power: 45,
          accuracy: 100,
        },
      ],
    }),
  ]
}
