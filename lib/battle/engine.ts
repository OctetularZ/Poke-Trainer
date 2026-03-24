import { calculateDamage } from "./damage"
import {
  BattleAction,
  BattleLogEntry,
  BattlePokemon,
  BattleSide,
  BattleState,
  TurnResolution,
} from "./types"

function cloneState(state: BattleState): BattleState {
  return {
    ...state,
    player: {
      ...state.player,
      pokemon: state.player.pokemon.map((p) => ({ ...p })),
    },
    ai: {
      ...state.ai,
      pokemon: state.ai.pokemon.map((p) => ({ ...p })),
    },
    battleLog: [...state.battleLog],
  }
}

function getActivePokemon(state: BattleState, side: BattleSide): BattlePokemon {
  const team = state[side]
  return team.pokemon[team.activeIndex]
}

function hasAvailablePokemon(state: BattleState, side: BattleSide) {
  return state[side].pokemon.some((pokemon) => !pokemon.fainted)
}

function getAvailableSwitchIndexes(state: BattleState, side: BattleSide) {
  const team = state[side]

  return team.pokemon
    .map((pokemon, index) => ({ pokemon, index }))
    .filter(({ pokemon, index }) => !pokemon.fainted && index !== team.activeIndex)
    .map(({ index }) => index)
}

function applySwitch(state: BattleState, side: BattleSide, toIndex: number, events: string[]) {
  const current = state[side]
  const target = current.pokemon[toIndex]

  if (!target || target.fainted || toIndex === current.activeIndex) {
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
    events.push(`${defender.name} fainted!`)
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
  if (actor.fainted) {
    events.push(`${actor.name} cannot move because it has fainted.`)
    return
  }

  applyAttack(state, action.side, action.moveIndex, events)
}

function forceAiSwitchIfFainted(state: BattleState, events: string[]) {
  if (state.winner) return

  const activeAiPokemon = getActivePokemon(state, "ai")
  if (!activeAiPokemon.fainted) return

  const availableSwitches = getAvailableSwitchIndexes(state, "ai")
  if (availableSwitches.length === 0) return

  const randomIndex = Math.floor(Math.random() * availableSwitches.length)
  const toIndex = availableSwitches[randomIndex]
  applySwitch(state, "ai", toIndex, events)
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
      state.winner = "ai"
      break
    }

    if (!hasAvailablePokemon(state, "ai")) {
      state.winner = "player"
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
