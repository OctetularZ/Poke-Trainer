"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import {
  BattleAction,
  BattleState,
  buildDefaultAiTeam,
  chooseRandomAiAction,
  mapTeamMembersToBattlePokemon,
  resolveTurn,
} from "@/lib/battle"
import { fetchUserTeam } from "@/app/actions/teams"
import Stage from "./Stage"

export default function BattlePage() {
  const [state, setState] = useState<BattleState | null>(null)

  const loadBattleState = useCallback(async () => {
    const members = await fetchUserTeam()
    const playerPokemon = mapTeamMembersToBattlePokemon(members)
    const aiPokemon = buildDefaultAiTeam()

    setState({
      turn: 1,
      winner: null,
      battleLog: ["Battle started!"],
      player: { activeIndex: 0, pokemon: playerPokemon },
      ai: { activeIndex: 0, pokemon: aiPokemon },
    })
  }, [])

  useEffect(() => {
    loadBattleState()
  }, [loadBattleState])

  const availableSwitches = useMemo(() => {
    if (!state) return []

    return state.player.pokemon
      .map((pokemon, index) => ({ pokemon, index }))
      .filter(
        ({ pokemon, index }) =>
          !pokemon.fainted && index !== state.player.activeIndex,
      )
  }, [state])

  if (!state) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.3,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <Image
            src={"/pixel-great-ball.png"}
            width={50}
            height={50}
            alt="pixel-great-ball-loading"
          />
        </motion.div>
      </div>
    )
  }

  const playerActive = state.player.pokemon[state.player.activeIndex]
  const aiActive = state.ai.pokemon[state.ai.activeIndex]

  const handlePlayerAction = (playerAction: BattleAction) => {
    if (state.winner) return

    const aiAction = chooseRandomAiAction(state)
    const { state: nextState, events } = resolveTurn(
      state,
      playerAction,
      aiAction,
    )

    setState(nextState)
  }

  const handleReset = () => {
    setState(null)
    loadBattleState()
  }

  return (
    <Stage attackerPokemon={playerActive} defenderPokemon={aiActive} />
    // <div className="mx-auto max-w-5xl p-6 text-white">
    //   <h1 className="text-3xl font-bold mb-2">Battle Demo</h1>
    //   <p className="text-gray-300 mb-6">
    //     Turn {state.turn} •{" "}
    //     {state.winner ? `Winner: ${state.winner.toUpperCase()}` : "In progress"}
    //   </p>

    //   <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    //     <div className="rounded-lg border border-white/20 p-4">
    //       <h2 className="text-xl font-semibold">Player Active</h2>
    //       <p className="text-lg">{playerActive.name}</p>
    //       <p className="text-sm text-gray-300">
    //         HP: {playerActive.currentHp}/{playerActive.maxHp}
    //       </p>
    //       <p className="text-sm text-gray-300">
    //         Types: {playerActive.types.join(", ")}
    //       </p>
    //     </div>

    //     <div className="rounded-lg border border-white/20 p-4">
    //       <h2 className="text-xl font-semibold">AI Active</h2>
    //       <p className="text-lg">{aiActive.name}</p>
    //       <p className="text-sm text-gray-300">
    //         HP: {aiActive.currentHp}/{aiActive.maxHp}
    //       </p>
    //       <p className="text-sm text-gray-300">
    //         Types: {aiActive.types.join(", ")}
    //       </p>
    //     </div>
    //   </section>

    //   <section className="rounded-lg border border-white/20 p-4 mb-6">
    //     <h3 className="text-lg font-semibold mb-3">Choose Move</h3>
    //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
    //       {playerActive.moves.map((move, index) => (
    //         <button
    //           key={move.id}
    //           disabled={Boolean(state.winner) || playerActive.fainted}
    //           onClick={() =>
    //             handlePlayerAction({
    //               type: "move",
    //               side: "player",
    //               moveIndex: index,
    //             })
    //           }
    //           className="bg-charmander-blue-500 hover:bg-charmander-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-md px-3 py-2 text-left"
    //         >
    //           {move.name} ({move.type})
    //         </button>
    //       ))}
    //     </div>
    //   </section>

    //   <section className="rounded-lg border border-white/20 p-4 mb-6">
    //     <h3 className="text-lg font-semibold mb-3">Switch Pokémon</h3>
    //     <div className="flex flex-wrap gap-2">
    //       {availableSwitches.map(({ pokemon, index }) => (
    //         <button
    //           key={pokemon.id}
    //           disabled={Boolean(state.winner)}
    //           onClick={() =>
    //             handlePlayerAction({
    //               type: "switch",
    //               side: "player",
    //               toIndex: index,
    //             })
    //           }
    //           className="bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-md px-3 py-2"
    //         >
    //           {pokemon.name} ({pokemon.currentHp}/{pokemon.maxHp})
    //         </button>
    //       ))}
    //     </div>
    //   </section>

    //   <section className="rounded-lg border border-white/20 p-4">
    //     <div className="flex items-center justify-between mb-3">
    //       <h3 className="text-lg font-semibold">Battle Log</h3>
    //       <button
    //         onClick={handleReset}
    //         className="bg-gray-700 hover:bg-gray-600 rounded-md px-3 py-1 transition-all"
    //       >
    //         Reset
    //       </button>
    //     </div>

    //     <div className="max-h-64 overflow-y-auto space-y-1 text-sm text-gray-200">
    //       {[...state.battleLog].reverse().map((line, index) => (
    //         <p key={`${line}-${index}`}>{line}</p>
    //       ))}
    //     </div>
    //   </section>
    // </div>
  )
}
