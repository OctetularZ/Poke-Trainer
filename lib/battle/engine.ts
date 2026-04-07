import { calculateDamage } from "./damage"
import {
  BattleAction,
  BattleLogEntry,
  BattlePokemon,
  BattleSide,
  BattleState,
  TurnResolution,
  TurnTimelineResolution,
  TurnTimelineStep,
} from "./types"

function cloneState(state: BattleState): BattleState {
  return {
    ...state,
    player: {
      ...state.player,
      pokemon: state.player.pokemon.map((p) => ({
        ...p,
        moves: p.moves.map((move) => ({ ...move })),
      })),
    },
    ai: {
      ...state.ai,
      pokemon: state.ai.pokemon.map((p) => ({
        ...p,
        moves: p.moves.map((move) => ({ ...move })),
      })),
    },
    battleLog: [...state.battleLog],
  }
}

function getActivePokemon(state: BattleState, side: BattleSide): BattlePokemon {
  const team = state[side]
  return team.pokemon[team.activeIndex]
}

function isPokemonFainted(pokemon: BattlePokemon) {
  return pokemon.fainted || pokemon.currentHp <= 0
}

function hasAvailablePokemon(state: BattleState, side: BattleSide) {
  return state[side].pokemon.some((pokemon) => !isPokemonFainted(pokemon))
}

function getAvailableSwitchIndexes(state: BattleState, side: BattleSide) {
  const team = state[side]

  return team.pokemon
    .map((pokemon, index) => ({ pokemon, index }))
    .filter(({ pokemon, index }) => !isPokemonFainted(pokemon) && index !== team.activeIndex)
    .map(({ index }) => index)
}

function applySwitch(state: BattleState, side: BattleSide, toIndex: number, events: string[]) {
  const current = state[side]
  const target = current.pokemon[toIndex]

  if (!target || isPokemonFainted(target) || toIndex === current.activeIndex) {
    events.push(`${side} failed to switch.`)
    return
  }

  current.activeIndex = toIndex
  events.push(`${side} switched to ${target.name}.`)
}

function applyAttack(state: BattleState, side: BattleSide, moveIndex: number, events: string[]) {
  const attacker = getActivePokemon(state, side)
  const defenderSide: BattleSide = side === "player" ? "ai" : "player"
  const defender = getActivePokemon(state, defenderSide)
  const move = attacker.moves[moveIndex]

  if (!move) {
    events.push(`${attacker.name} has no move in that slot.`)
    return
  }

  if (move.remainingPP != null) {
    if (move.remainingPP <= 0) {
      events.push(`${attacker.name} has no PP left for ${move.name}.`)
      return
    }

    move.remainingPP = Math.max(0, move.remainingPP - 1)
  }

  const result = calculateDamage(attacker, defender, move)

  if (!result.hit) {
    events.push(`${attacker.name} used ${move.name}, but it missed!`)
    return
  }

  defender.currentHp = Math.max(0, defender.currentHp - result.damage)
  if (defender.currentHp === 0) {
    defender.fainted = true
  }

  // Haven't accounted for very effective vs super effective (when both Pokemon types are weak to type of move)
  events.push(`${attacker.name} used ${move.name} for ${result.damage} damage.`)

  if (result.wasCritical) {
    events.push("A critical hit!")
  }

  if (result.typeMultiplier > 1) {
    events.push("It's super effective!")
  }

  if (result.typeMultiplier > 0 && result.typeMultiplier < 1) {
    events.push("It's not very effective...")
  }

  if (result.typeMultiplier === 0) {
    events.push("It had no effect.")
  }

  if (defender.fainted) {
    events.push(`${defender.name} has fainted!`)
  }
}

function actionPriority(state: BattleState, action: BattleAction) {
  if (action.type === "switch") return 10

  const actor = getActivePokemon(state, action.side)
  const move = actor.moves[action.moveIndex]
  return move?.priority ?? 0
}

function shouldActFirst(state: BattleState, first: BattleAction, second: BattleAction) {
  const firstPriority = actionPriority(state, first)
  const secondPriority = actionPriority(state, second)

  if (firstPriority !== secondPriority) {
    return firstPriority > secondPriority
  }

  const firstSpeed = getActivePokemon(state, first.side).speed
  const secondSpeed = getActivePokemon(state, second.side).speed

  if (firstSpeed !== secondSpeed) {
    return firstSpeed > secondSpeed
  }

  return Math.random() >= 0.5
}

function resolveAction(state: BattleState, action: BattleAction, events: string[]) {
  if (action.type === "switch") {
    applySwitch(state, action.side, action.toIndex, events)
    return
  }

  const actor = getActivePokemon(state, action.side)
  if (isPokemonFainted(actor)) {
    events.push(`${actor.name} cannot move because it has fainted.`)
    return
  }

  applyAttack(state, action.side, action.moveIndex, events)
}

function forceAiSwitchIfFainted(state: BattleState, events: string[]) {
  if (state.winner) return

  const activeAiPokemon = getActivePokemon(state, "ai")
  if (!isPokemonFainted(activeAiPokemon)) return

  const availableSwitches = getAvailableSwitchIndexes(state, "ai")
  if (availableSwitches.length === 0) return

  const randomIndex = Math.floor(Math.random() * availableSwitches.length)
  const toIndex = availableSwitches[randomIndex]
  applySwitch(state, "ai", toIndex, events)
}

function setWinner(state: BattleState, winner: BattleSide, events: string[]) {
  if (state.winner) return

  state.winner = winner
  events.push(winner === "player" ? "Player has won!" : "AI has won!")
}

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

    if (!hasAvailablePokemon(state, "player")) {
      setWinner(state, "ai", events)
      break
    }

    if (!hasAvailablePokemon(state, "ai")) {
      setWinner(state, "player", events)
      break
    }
  }

  forceAiSwitchIfFainted(state, events)

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

    if (!hasAvailablePokemon(state, "player")) {
      setWinner(state, "ai", events)
      break
    }

    if (!hasAvailablePokemon(state, "ai")) {
      setWinner(state, "player", events)
      break
    }
  }

  const previousAiIndex = state.ai.activeIndex
  const eventCountBeforeForcedSwitch = events.length
  forceAiSwitchIfFainted(state, events)
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
