import {
  BattleAction,
  BattleLogEntry,
  BattleSide,
  BattleState,
  TurnResolution,
  TurnTimelineResolution,
  TurnTimelineStep,
} from "../types"
import { cloneState } from "./state"
import { getActivePokemon } from "./pokemon"
import {
  clearTurnVolatileFlags,
  forceAiSwitchIfFainted,
  resolveAction,
  shouldActFirst,
  trySetWinnerIfNoPokemon,
} from "./turn"
import { handleForcedSwitch } from "./switch"
import { applyEndOfTurnStatus } from "./status"

export function resolveTurn(
  currentState: BattleState,
  playerAction: BattleAction,
  aiAction: BattleAction,
): TurnResolution {
  const state = cloneState(currentState)
  const currentTurn = state.turn
  const events: string[] = []
  const turnLogEntries: BattleLogEntry[] = [
    {
      kind: "turn",
      message: `Turn ${currentTurn}`,
      turn: currentTurn,
    },
  ]

  const orderedActions = shouldActFirst(state, playerAction, aiAction)
    ? [playerAction, aiAction]
    : [aiAction, playerAction]

  for (const action of orderedActions) {
    resolveAction(state, action, events)

    if (trySetWinnerIfNoPokemon(state, events)) {
      break
    }

    if(state.pendingForcedSwitchSide) {
      break
    }
  }

  if (!state.pendingForcedSwitchSide && !state.winner) {
    applyEndOfTurnStatus(state, events)
    trySetWinnerIfNoPokemon(state, events)
  }

  if (state.pendingForcedSwitchSide !== "player") {
    forceAiSwitchIfFainted(state, events)
  }
  clearTurnVolatileFlags(state)

  state.turn += 1
  turnLogEntries.push(
    ...events.map((event) => ({
      kind: "event" as const,
      message: event,
      turn: currentTurn,
    })),
  )
  state.battleLog = [...state.battleLog, ...turnLogEntries]

  return {
    state,
    events,
  }
}

export function resolveTurnTimeline(
  currentState: BattleState,
  playerAction: BattleAction,
  aiAction: BattleAction,
): TurnTimelineResolution {
  const state = cloneState(currentState)
  const currentTurn = state.turn
  const events: string[] = []
  const steps: TurnTimelineStep[] = []

  const orderedActions = shouldActFirst(state, playerAction, aiAction)
    ? [playerAction, aiAction]
    : [aiAction, playerAction]

  for (const action of orderedActions) {
    const previousAiIndex = state.ai.activeIndex
    const previousPlayerIndex = state.player.activeIndex
    const eventCountBefore = events.length

    resolveAction(state, action, events)
    const latestEvents = events.slice(eventCountBefore)

    if (action.type === "move") {
      const actor = getActivePokemon(state, action.side)
      const move = actor.moves[action.moveIndex]
      const wasMoveUsed = latestEvents.some((event) => event.includes(" used "))

      if (wasMoveUsed) {
        steps.push({
          kind: "move",
          side: action.side,
          moveType: move?.type,
          events: latestEvents,
          state: cloneState(state),
        })
      }
    }

    if (action.type === "switch") {
      const didSwitch =
        action.side === "ai"
          ? previousAiIndex !== state.ai.activeIndex
          : previousPlayerIndex !== state.player.activeIndex

      if (didSwitch) {
        steps.push({
          kind: "switch",
          side: action.side,
          events: latestEvents,
          state: cloneState(state),
        })
      }
    }

    if (trySetWinnerIfNoPokemon(state, events)) {
      break
    }

    if(state.pendingForcedSwitchSide) {
      break
    }
  }

  if (!state.pendingForcedSwitchSide && !state.winner) {
    const eventCountBeforeStatus = events.length
    applyEndOfTurnStatus(state, events)
    trySetWinnerIfNoPokemon(state, events)
    const statusEvents = events.slice(eventCountBeforeStatus)

    if (statusEvents.length > 0) {
      steps.push({
        kind: "status",
        side: "player",
        events: statusEvents,
        state: cloneState(state),
      })
    }
  }

  const previousAiIndex = state.ai.activeIndex
  const eventCountBeforeForcedSwitch = events.length
  if (state.pendingForcedSwitchSide !== "player") {
    forceAiSwitchIfFainted(state, events)
  }
  clearTurnVolatileFlags(state)
  const forcedSwitchEvents = events.slice(eventCountBeforeForcedSwitch)
  if (previousAiIndex !== state.ai.activeIndex) {
    steps.push({
      kind: "forced-switch",
      side: "ai",
      events: forcedSwitchEvents,
      state: cloneState(state),
    })
  }

  const turnLogEntries: BattleLogEntry[] = [
    {
      kind: "turn",
      message: `Turn ${currentTurn}`,
      turn: currentTurn,
    },
  ]

  state.turn += 1
  turnLogEntries.push(
    ...events.map((event) => ({
      kind: "event" as const,
      message: event,
      turn: currentTurn,
    })),
  )
  state.battleLog = [...state.battleLog, ...turnLogEntries]

  return {
    steps,
    finalState: state,
    events,
  }
}

export function resolveForcedSwitchTimeline(currentState: BattleState, side: BattleSide, toIndex: number): TurnTimelineResolution {
  const prevIndex = currentState[side].activeIndex
  const {state, events} = handleForcedSwitch(currentState, side, toIndex)

  const didSwitch = state[side].activeIndex !== prevIndex

  const steps: TurnTimelineStep[] = didSwitch
  ? [
    {
      kind: "forced-switch",
      side,
      events,
      state: cloneState(state)
    }
  ] : []

  return {
    steps,
    finalState: state,
    events
  }
}