"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import {
  BattleAction,
  BattleState,
  buildDefaultAiTeam,
  chooseRandomAiAction,
  getTypeMultiplier,
  mapTeamMembersToBattlePokemon,
  resolveTurn,
} from "@/lib/battle"
import { fetchUserTeam } from "@/app/actions/teams"
import Stage from "./Stage"
import MoveButton from "./MoveButton/MoveButton"
import SwitchButton from "./SwitchButton/SwitchButton"
import BattleLog from "./BattleLog"

export default function BattlePage() {
  const [state, setState] = useState<BattleState | null>(null)

  const loadBattleState = useCallback(async () => {
    const members = await fetchUserTeam()
    const playerPokemon = mapTeamMembersToBattlePokemon(members)
    const aiPokemon = buildDefaultAiTeam()

    setState({
      turn: 1,
      winner: null,
      battleLog: [
        { kind: "turn", message: "Turn 0", turn: 0 },
        {
          kind: "event",
          message: "Battle started!",
          turn: 0,
        },
      ],
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
    // Need to fix margin in the div below - causing overflow on the x-axis
    <div className="flex flex-col items-center w-full mx-20">
      <div className="w-full flex flex-row items-start mt-10 gap-5">
        <div className="flex flex-col w-full max-w-[50rem] gap-5">
          <Stage
            turnNumber={state.turn}
            attackerPokemon={playerActive}
            defenderPokemon={aiActive}
          />
          <div className="flex flex-col items-start">
            <h1 className="text-xl text-white mb-3 font-semibold">Moves</h1>
            <div className="w-full grid grid-cols-4 gap-4">
              {playerActive.moves.map((move, index) => (
                <MoveButton
                  key={move.id}
                  disabled={Boolean(state.winner) || playerActive.fainted}
                  onClick={() =>
                    handlePlayerAction({
                      type: "move",
                      side: "player",
                      moveIndex: index,
                    })
                  }
                  moveName={move.name}
                  moveEffect={move.effect}
                  movePower={move.power}
                  moveAccuracy={move.accuracy}
                  moveCategory={move.category}
                  moveType={move.type}
                  movePPLeft={move.remainingPP}
                  movePPMax={move.maxPP}
                  moveEffectiveness={getTypeMultiplier(
                    move.type,
                    aiActive.types,
                  )}
                  contact={move.contact}
                  targetPokemon={aiActive.name}
                />
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col items-start mb-5">
            <h1 className="text-xl text-white mb-3 font-semibold">
              Switch Pokemon
            </h1>
            <div className="w-full grid grid-cols-5 gap-3">
              {availableSwitches.map(({ pokemon, index }) => (
                <SwitchButton
                  key={pokemon.id}
                  disabled={Boolean(state.winner) || pokemon.fainted}
                  onClick={() =>
                    handlePlayerAction({
                      type: "switch",
                      side: "player",
                      toIndex: index,
                    })
                  }
                  pokemonName={pokemon.name}
                  pokemonSprites={pokemon.sprites}
                  currentHp={pokemon.currentHp}
                  maxHp={pokemon.maxHp}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-white text-2xl">Battle Log</h1>
          <BattleLog battleLog={state.battleLog} />
        </div>
      </div>
    </div>

    // <div className="mx-auto max-w-5xl p-6 text-white">
    //   <h1 className="text-3xl font-bold mb-2">Battle Demo</h1>
    //   <p className="text-gray-300 mb-6">
    //     Turn {state.turn} •{" "}
    //     {state.winner ? `Winner: ${state.winner.toUpperCase()}` : "In progress"}
    //   </p>

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
    //   </section>
    // </div>
  )
}
