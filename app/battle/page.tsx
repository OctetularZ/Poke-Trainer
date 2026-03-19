"use client"

import { useMemo, useState } from "react"
import {
  BattleAction,
  BattlePokemon,
  BattleState,
  chooseRandomAiAction,
  resolveTurn,
} from "@/lib/battle"

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
  }
}

function buildInitialState(): BattleState {
  return {
    turn: 1,
    winner: null,
    battleLog: ["Battle started!"],
    player: {
      activeIndex: 0,
      pokemon: [
        createPokemon({
          id: 6,
          name: "Charizard",
          types: ["fire", "flying"],
          maxHp: 170,
          currentHp: 170,
          speed: 120,
          specialAttack: 135,
          moves: [
            {
              id: 1,
              name: "Flamethrower",
              type: "fire",
              category: "special",
              power: 90,
              accuracy: 100,
            },
            {
              id: 2,
              name: "Air Slash",
              type: "flying",
              category: "special",
              power: 75,
              accuracy: 95,
            },
            {
              id: 3,
              name: "Dragon Claw",
              type: "dragon",
              category: "physical",
              power: 80,
              accuracy: 100,
            },
            {
              id: 4,
              name: "Slash",
              type: "normal",
              category: "physical",
              power: 70,
              accuracy: 100,
            },
          ],
        }),
        createPokemon({
          id: 9,
          name: "Blastoise",
          types: ["water"],
          maxHp: 180,
          currentHp: 180,
          defense: 120,
          moves: [
            {
              id: 5,
              name: "Surf",
              type: "water",
              category: "special",
              power: 90,
              accuracy: 100,
            },
            {
              id: 6,
              name: "Ice Beam",
              type: "ice",
              category: "special",
              power: 90,
              accuracy: 100,
            },
            {
              id: 7,
              name: "Bite",
              type: "dark",
              category: "physical",
              power: 60,
              accuracy: 100,
            },
            {
              id: 8,
              name: "Tackle",
              type: "normal",
              category: "physical",
              power: 40,
              accuracy: 100,
            },
          ],
        }),
      ],
    },
    ai: {
      activeIndex: 0,
      pokemon: [
        createPokemon({
          id: 25,
          name: "Pikachu",
          types: ["electric"],
          maxHp: 140,
          currentHp: 140,
          speed: 130,
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
      ],
    },
  }
}

export default function BattlePage() {
  const [state, setState] = useState<BattleState>(buildInitialState)
  const playerActive = state.player.pokemon[state.player.activeIndex]
  const aiActive = state.ai.pokemon[state.ai.activeIndex]

  const availableSwitches = useMemo(
    () =>
      state.player.pokemon
        .map((pokemon, index) => ({ pokemon, index }))
        .filter(
          ({ pokemon, index }) =>
            !pokemon.fainted && index !== state.player.activeIndex,
        ),
    [state.player.activeIndex, state.player.pokemon],
  )

  const handlePlayerAction = (playerAction: BattleAction) => {
    if (state.winner) return

    const aiAction = chooseRandomAiAction(state)
    const { state: nextState, events } = resolveTurn(
      state,
      playerAction,
      aiAction,
    )

    setState(nextState)
    console.log("Turn events:", events)
  }

  const handleReset = () => {
    setState(buildInitialState())
  }

  return (
    <main className="mx-auto max-w-5xl p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">Battle Demo</h1>
      <p className="text-gray-300 mb-6">
        Turn {state.turn} •{" "}
        {state.winner ? `Winner: ${state.winner.toUpperCase()}` : "In progress"}
      </p>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg border border-white/20 p-4">
          <h2 className="text-xl font-semibold">Player Active</h2>
          <p className="text-lg">{playerActive.name}</p>
          <p className="text-sm text-gray-300">
            HP: {playerActive.currentHp}/{playerActive.maxHp}
          </p>
          <p className="text-sm text-gray-300">
            Types: {playerActive.types.join(", ")}
          </p>
        </div>

        <div className="rounded-lg border border-white/20 p-4">
          <h2 className="text-xl font-semibold">AI Active</h2>
          <p className="text-lg">{aiActive.name}</p>
          <p className="text-sm text-gray-300">
            HP: {aiActive.currentHp}/{aiActive.maxHp}
          </p>
          <p className="text-sm text-gray-300">
            Types: {aiActive.types.join(", ")}
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-white/20 p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Choose Move</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {playerActive.moves.map((move, index) => (
            <button
              key={move.id}
              disabled={Boolean(state.winner) || playerActive.fainted}
              onClick={() =>
                handlePlayerAction({
                  type: "move",
                  side: "player",
                  moveIndex: index,
                })
              }
              className="bg-charmander-blue-500 hover:bg-charmander-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-md px-3 py-2 text-left"
            >
              {move.name} ({move.type})
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-white/20 p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Switch Pokémon</h3>
        <div className="flex flex-wrap gap-2">
          {availableSwitches.map(({ pokemon, index }) => (
            <button
              key={pokemon.id}
              disabled={Boolean(state.winner)}
              onClick={() =>
                handlePlayerAction({
                  type: "switch",
                  side: "player",
                  toIndex: index,
                })
              }
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-md px-3 py-2"
            >
              {pokemon.name} ({pokemon.currentHp}/{pokemon.maxHp})
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-white/20 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Battle Log</h3>
          <button
            onClick={handleReset}
            className="bg-gray-700 hover:bg-gray-600 rounded-md px-3 py-1 transition-all"
          >
            Reset
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1 text-sm text-gray-200">
          {[...state.battleLog].reverse().map((line, index) => (
            <p key={`${line}-${index}`}>{line}</p>
          ))}
        </div>
      </section>
    </main>
  )
}
