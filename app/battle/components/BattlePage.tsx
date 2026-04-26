"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import {
  BattleAction,
  BattleState,
  chooseRandomAiAction,
  getTypeMultiplier,
  mapTeamMembersToBattlePokemon,
  resolveForcedSwitchTimeline,
  resolveTurnTimeline,
} from "@/lib/battle"
import { fetchAiTeam, fetchUserTeam } from "@/app/actions/teams"
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

function queueStatStageEffects(
  stepEvents: string[],
  queueAttackEffect: (
    type: string,
    fromSide: "player" | "ai",
    toSide: "player" | "ai",
    delayMs?: number,
  ) => void,
) {
  const seen = new Set<string>()

  for (const message of stepEvents) {
    const rose = message.endsWith(" rose!")
    const fell = message.endsWith(" fell!")
    if (!rose && !fell) continue

    const side = message.startsWith("Your ")
      ? "player"
      : message.startsWith("Opposing ")
        ? "ai"
        : null
    if (!side) continue

    const type = rose ? "stat-up" : "stat-down"
    const key = `${type}:${side}`
    if (seen.has(key)) continue

    seen.add(key)
    queueAttackEffect(type, side, side)
  }
}

export default function BattlePage() {
  const [state, setState] = useState<BattleState | null>(null)
  const [attackEffects, setAttackEffects] = useState<AttackEffect[]>([])
  const [isResolvingTurn, setIsResolvingTurn] = useState(false)
  const [error, setError] = useState<string | null>("")
  const attackEffectNonceRef = useRef(1)
  const pendingTimeoutsRef = useRef<number[]>([])
  const turnSequenceRef = useRef(0)

  // Sets the initial teams, states, and more for initiating battle
  // More timings also configured/calculated below
  const loadBattleState = useCallback(async () => {
    try {
      const members = await fetchUserTeam()
      const playerPokemon = mapTeamMembersToBattlePokemon(members)
      const aiMembers = await fetchAiTeam()
      const aiPokemon = mapTeamMembersToBattlePokemon(aiMembers)

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
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "Unauthorized")
          setError("You must be logged in to battle!")
        else
          setError(
            "You need to set an active team in the team builder page before battling.",
          )
      } else {
        setError("Something Went Wrong!")
      }
    }
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

  if (error) {
    return (
      <div className="flex flex-col flex-wrap items-center mt-10">
        <h1 className="text-red-500 text-center text-2xl text-wrap">{error}</h1>
      </div>
    )
  }

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

    const applyStep = (
      stepState: BattleState,
      stepEvents: string[],
      turnForLogs: number,
    ) => {
      setState((prev) => {
        if (!prev) return stepState

        const logEntries = [] as BattleState["battleLog"]

        if (stepEvents.length > 0) {
          logEntries.push(
            ...stepEvents.map((message) => ({
              kind: "event" as const,
              message,
              turn: turnForLogs,
            })),
          )
        }

        return {
          ...stepState,
          battleLog: [...prev.battleLog, ...logEntries],
        }
      })
    }

    const runTimelineSteps = async (
      steps: Awaited<ReturnType<typeof resolveTurnTimeline>>["steps"],
      turnForLogs: number,
    ) => {
      for (const step of steps) {
        if (turnSequenceRef.current !== currentSequenceId) {
          return false
        }

        if (step.kind === "move") {
          if (step.moveType && step.moveCategory !== "status") {
            queueAttackEffect(
              step.moveType,
              step.side,
              step.side === "player" ? "ai" : "player",
            )
          }

          queueStatStageEffects(step.events, queueAttackEffect)

          await waitFor(MOVE_TO_DAMAGE_DELAY_MS)
          if (turnSequenceRef.current !== currentSequenceId) {
            return false
          }

          applyStep(step.state, step.events, turnForLogs)
          await waitFor(BETWEEN_ACTIONS_DELAY_MS)
          continue
        }

        if (step.kind === "switch" || step.kind === "forced-switch") {
          applyStep(step.state, step.events, turnForLogs)
          await waitFor(SWITCH_ANIMATION_DELAY_MS)
          if (turnSequenceRef.current !== currentSequenceId) {
            return false
          }

          await waitFor(BETWEEN_ACTIONS_DELAY_MS)
          continue
        }

        if (step.kind === "status") {
          applyStep(step.state, step.events, turnForLogs)
          await waitFor(BETWEEN_ACTIONS_DELAY_MS)
        }
      }

      return true
    }

    if (state.pendingForcedSwitchSide === "player") {
      if (playerAction.type !== "switch") {
        setIsResolvingTurn(false)
        return
      }

      const { steps, finalState } = resolveForcedSwitchTimeline(
        state,
        "player",
        playerAction.toIndex,
      )

      const completedForcedSwitch = await runTimelineSteps(steps, state.turn)
      if (
        !completedForcedSwitch ||
        turnSequenceRef.current !== currentSequenceId
      ) {
        setIsResolvingTurn(false)
        return
      }

      setState((prev) =>
        prev ? { ...finalState, battleLog: prev.battleLog } : finalState,
      )
      setIsResolvingTurn(false)
      return
    }

    const aiAction = chooseRandomAiAction(state)

    const { steps, finalState } = resolveTurnTimeline(
      state,
      playerAction,
      aiAction,
    )

    const completed = await runTimelineSteps(steps, state.turn)
    if (!completed || turnSequenceRef.current !== currentSequenceId) {
      setIsResolvingTurn(false)
      return
    }

    setState((prev) => {
      if (!prev) return finalState

      if (finalState.winner) {
        const winnerMessage =
          finalState.winner === "player" ? "Player has won!" : "AI has won!"
        const hasWinnerLog = prev.battleLog.some(
          (entry) => entry.kind === "winner" && entry.message === winnerMessage,
        )

        return {
          ...finalState,
          battleLog: hasWinnerLog
            ? prev.battleLog
            : [
                ...prev.battleLog,
                {
                  kind: "winner",
                  message: winnerMessage,
                  turn: state.turn,
                },
              ],
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

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[80rem] w-full flex flex-row max-xl:flex-col max-xl:w-200 items-start max-xl:self-center mt-10 px-4 gap-5">
        <div className="flex flex-col w-full gap-5">
          <Stage
            turnNumber={state.turn}
            attackerPokemon={playerActive}
            defenderPokemon={aiActive}
            winner={state.winner}
            pendingForcedSwitchSide={state.pendingForcedSwitchSide}
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
                    isResolvingTurn ||
                    state.pendingForcedSwitchSide === "player"
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
            <div className="w-full grid grid-cols-6 gap-1">
              {state.player.pokemon.map((pokemon, index) => (
                <SwitchButton
                  key={pokemon.id}
                  disabled={
                    Boolean(state.winner) ||
                    pokemon.fainted ||
                    isResolvingTurn ||
                    index === state.player.activeIndex
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
        <div className="flex flex-col items-start gap-2 max-xl:w-full max-xl:mb-10">
          <h1 className="text-white text-2xl">Battle Log</h1>
          <BattleLog battleLog={state.battleLog} />
        </div>
      </div>
    </div>
  )
}
