"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import {
  BattleAction,
  BattleState,
  buildDefaultAiTeam,
  chooseRandomAiAction,
  getTypeMultiplier,
  mapTeamMembersToBattlePokemon,
  resolveTurnTimeline,
} from "@/lib/battle"
import { fetchUserTeam } from "@/app/actions/teams"
import Stage from "./Stage"
import MoveButton from "./MoveButton/MoveButton"
import SwitchButton from "./SwitchButton/SwitchButton"
import BattleLog from "./BattleLog"

type AttackEffect = {
  nonce: number
  type: string
  fromSide: "player" | "ai"
  toSide: "player" | "ai"
}

const MOVE_TO_DAMAGE_DELAY_MS = 1000
const BETWEEN_ACTIONS_DELAY_MS = 500
const SWITCH_ANIMATION_DELAY_MS = 900

export default function BattlePage() {
  const [state, setState] = useState<BattleState | null>(null)
  const [attackEffects, setAttackEffects] = useState<AttackEffect[]>([])
  const [isResolvingTurn, setIsResolvingTurn] = useState(false)
  const attackEffectNonceRef = useRef(1)
  const pendingTimeoutsRef = useRef<number[]>([])
  const turnSequenceRef = useRef(0)

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

  useEffect(() => {
    return () => {
      turnSequenceRef.current += 1
      pendingTimeoutsRef.current.forEach((id) => window.clearTimeout(id))
      pendingTimeoutsRef.current = []
    }
  }, [])

  const waitFor = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      const timeoutId = window.setTimeout(resolve, ms)
      pendingTimeoutsRef.current.push(timeoutId)
    })
  }, [])

  const availableSwitches = useMemo(() => {
    if (!state) return []

    return state.player.pokemon
      .map((pokemon, index) => ({ pokemon, index }))
      .filter(
        ({ pokemon, index }) =>
          !pokemon.fainted && index !== state.player.activeIndex,
      )
  }, [state])

  const queueAttackEffect = useCallback(
    (
      type: string,
      fromSide: "player" | "ai",
      toSide: "player" | "ai",
      delayMs = 0,
    ) => {
      const schedule = () => {
        const nonce = attackEffectNonceRef.current
        attackEffectNonceRef.current += 1

        setAttackEffects((prev) => [...prev, { nonce, type, fromSide, toSide }])

        const cleanupId = window.setTimeout(() => {
          setAttackEffects((prev) =>
            prev.filter((effect) => effect.nonce !== nonce),
          )
        }, 2200)

        pendingTimeoutsRef.current.push(cleanupId)
      }

      if (delayMs <= 0) {
        schedule()
        return
      }

      const timeoutId = window.setTimeout(schedule, delayMs)
      pendingTimeoutsRef.current.push(timeoutId)
    },
    [],
  )

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

  const handlePlayerAction = async (playerAction: BattleAction) => {
    if (state.winner || isResolvingTurn) return

    setIsResolvingTurn(true)
    const currentSequenceId = turnSequenceRef.current + 1
    turnSequenceRef.current = currentSequenceId

    const aiAction = chooseRandomAiAction(state)

    const { steps, finalState } = resolveTurnTimeline(
      state,
      playerAction,
      aiAction,
    )

    const applyStep = (stepState: BattleState, stepEvents: string[]) => {
      setState((prev) => {
        if (!prev) return stepState

        const logEntries = [] as BattleState["battleLog"]

        if (stepEvents.length > 0) {
          logEntries.push(
            ...stepEvents.map((message) => ({
              kind: "event" as const,
              message,
              turn: state.turn,
            })),
          )
        }

        return {
          ...stepState,
          battleLog: [...prev.battleLog, ...logEntries],
        }
      })
    }

    for (const step of steps) {
      if (turnSequenceRef.current !== currentSequenceId) return

      if (step.kind === "move") {
        if (step.moveType) {
          queueAttackEffect(
            step.moveType,
            step.side,
            step.side === "player" ? "ai" : "player",
          )
        }

        await waitFor(MOVE_TO_DAMAGE_DELAY_MS)
        if (turnSequenceRef.current !== currentSequenceId) return

        applyStep(step.state, step.events)
        await waitFor(BETWEEN_ACTIONS_DELAY_MS)
        continue
      }

      if (step.kind === "switch" || step.kind === "forced-switch") {
        applyStep(step.state, step.events)
        await waitFor(SWITCH_ANIMATION_DELAY_MS)
        if (turnSequenceRef.current !== currentSequenceId) return

        await waitFor(BETWEEN_ACTIONS_DELAY_MS)
      }
    }

    if (turnSequenceRef.current !== currentSequenceId) return
    setState((prev) => {
      if (!prev) return finalState

      if (finalState.winner) {
        return {
          ...finalState,
          battleLog: prev.battleLog,
        }
      }

      return {
        ...finalState,
        battleLog: [
          ...prev.battleLog,
          {
            kind: "turn",
            message: `Turn ${finalState.turn}`,
            turn: finalState.turn,
          },
        ],
      }
    })
    setIsResolvingTurn(false)
  }

  const handleReset = () => {
    turnSequenceRef.current += 1
    pendingTimeoutsRef.current.forEach((id) => window.clearTimeout(id))
    pendingTimeoutsRef.current = []
    setAttackEffects([])
    setIsResolvingTurn(false)
    setState(null)
    loadBattleState()
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[80rem] w-full flex flex-row items-start mt-10 px-4 gap-5">
        <div className="flex flex-col w-full gap-5">
          <Stage
            turnNumber={state.turn}
            attackerPokemon={playerActive}
            defenderPokemon={aiActive}
            winner={state.winner}
            attackEffects={attackEffects}
            onAttackEffectComplete={(nonce) => {
              setAttackEffects((prev) =>
                prev.filter((effect) => effect.nonce !== nonce),
              )
            }}
          />
          <div className="flex flex-col items-start">
            <h1 className="text-xl text-white mb-3 font-semibold">Moves</h1>
            <div className="w-full grid grid-cols-4 gap-4">
              {playerActive.moves.map((move, index) => (
                <MoveButton
                  key={move.id}
                  disabled={
                    Boolean(state.winner) ||
                    playerActive.fainted ||
                    isResolvingTurn
                  }
                  onClick={() =>
                    handlePlayerAction({
                      type: "move",
                      side: "player",
                      moveIndex: index,
                    })
                  }
                  move={move}
                  moveEffectiveness={getTypeMultiplier(
                    move.type,
                    aiActive.types,
                  )}
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
                  disabled={
                    Boolean(state.winner) || pokemon.fainted || isResolvingTurn
                  }
                  onClick={() =>
                    handlePlayerAction({
                      type: "switch",
                      side: "player",
                      toIndex: index,
                    })
                  }
                  pokemon={pokemon}
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
