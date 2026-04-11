import { calculateDamage } from "./damage"
import {
  BattleAction,
  BattleEffect,
  BattleEffectTarget,
  BattleLogEntry,
  BattlePokemon,
  BattleSide,
  BattleStatus,
  BattleState,
  TurnResolution,
  TurnTimelineResolution,
  TurnTimelineStep,
  BattleStatStages,
} from "./types"

const MIN_STAGE = -6
const MAX_STAGE = 6
const DEFAULT_STAT_STAGES: BattleStatStages = {
  attack: 0,
  defense: 0,
  specialAttack: 0,
  specialDefense: 0,
  speed: 0,
  accuracy: 0,
  evasion: 0
}

function randomPercentRoll() {
  return Math.floor(Math.random() * 100) + 1
}

function shouldApplyChance(chance: number | null | undefined) {
  if (chance == null) return true
  if (chance <= 0) return false
  if (chance >= 100) return true

  return randomPercentRoll() <= chance
}

function getStageMultiplier(stage: number) {
  if (stage >= 0) {
    return (2 + stage) / 2
  }

  return 2 / (2 - stage)
}

function getEffectiveSpeed(pokemon: BattlePokemon) {
  const speedStage = pokemon.statStages?.speed ?? 0
  return Math.floor(pokemon.speed * getStageMultiplier(speedStage))
}

function getMoveEffects(move: BattlePokemon["moves"][number]): BattleEffect[] {
  if (move.effectList?.length) {
    return move.effectList
  }

  if (!move.effectCode) return []

  return [
    {
      code: move.effectCode,
      chance: move.effectChance ?? null,
      target: (move.effectTarget as BattleEffectTarget | undefined) ?? null,
      data:
        move.effectData && typeof move.effectData === "object" && !Array.isArray(move.effectData)
          ? (move.effectData as Record<string, unknown>)
          : null,
    },
  ]
}

function resolveEffectTargets(
  effectTarget: BattleEffectTarget,
  attacker: BattlePokemon,
  defender: BattlePokemon,
) {
  if (effectTarget === "both") {
    return [attacker, defender]
  }

  if (effectTarget === "target") {
    return [defender]
  }

  return [attacker]
}

// Resolve status effects
function asBattleStatus(value: unknown): BattleStatus | null {
  if (value === "burn" || value === "poison" || value === "badly_poison") return value
  if (value === "paralysis" || value === "sleep" || value === "freeze") return value
  return null
}

function applyStatusEffect(target: BattlePokemon, status: BattleStatus, events: string[]) {
  if (isPokemonFainted(target)) return

  if (target.status) {
    if (target.status === "badly_poison") {
      events.push(`${target.name} is already badly poisoned.`)
    }
    else {
      events.push(`${target.name} is already affected by ${target.status}.`)
    }
    return
  }

  target.status = status
  if (status === "badly_poison") {
    events.push(`${target.name} is now badly poisoned!`)
  }
  else {
    events.push(`${target.name} is now affected by ${status}!`)
  }
}

function applyStatChanges(
  target: BattlePokemon,
  changes: Array<Record<string, unknown>>,
  events: string[],
) {
  if (isPokemonFainted(target)) return

  if (!target.statStages) {
    target.statStages = {
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
      accuracy: 0,
      evasion: 0,
    }
  }

  for (const change of changes) {
    const stat = change.stat
    const direction = change.direction
    const stages = change.stages

    if (
      typeof stat !== "string" ||
      typeof direction !== "string" ||
      typeof stages !== "number" ||
      !(stat in target.statStages)
    ) {
      continue
    }

    const signedStages = direction === "down" ? -Math.abs(stages) : Math.abs(stages)
    const current = target.statStages[stat as keyof NonNullable<typeof target.statStages>]
    const next = Math.max(MIN_STAGE, Math.min(MAX_STAGE, current + signedStages))

    target.statStages[stat as keyof NonNullable<typeof target.statStages>] = next

    if (next === current) continue

    const verb = signedStages > 0 ? "rose" : "fell"
    if (stat === "specialAttack") {
      events.push(`${target.name}'s special attack ${verb}!`)
    }
    else if (stat === "specialDefense") {
      events.push(`${target.name}'s special defense ${verb}!`)
    }
    else {
      events.push(`${target.name}'s ${stat} ${verb}!`)
    }
  }
}

function handleForcedSwitch(currentState: BattleState, side: BattleSide, toIndex: number) {
  const state = cloneState(currentState)
  const events: string[] = []
  const prevIndex = state[side].activeIndex
  applySwitch(state, side, toIndex, events)

  if (state[side].activeIndex !== prevIndex) {
    state.pendingForcedSwitchSide = null
  }

  return {state, events}
}

function applyMoveEffects(
  attacker: BattlePokemon,
  defender: BattlePokemon,
  state: BattleState,
  attckerSide: BattleSide,
  defenderSide: BattleSide,
  move: BattlePokemon["moves"][number],
  damageDealt: number,
  events: string[],
) {
  const effects = getMoveEffects(move)

  for (const effect of effects) {
    if (!shouldApplyChance(effect.chance)) continue

    const targets = resolveEffectTargets(effect.target, attacker, defender)

    if (effect.code === "status_apply") {
      const status = asBattleStatus(effect.data?.status)
      if (!status) continue

      for (const target of targets) {
        applyStatusEffect(target, status, events)
      }
      continue
    }

    if (effect.code === "flinch") {
      for (const target of targets) {
        if (isPokemonFainted(target)) continue
        target.flinched = true
        events.push(`${target.name} flinched!`)
      }
      continue
    }

    if (effect.code === "heal_self") {
      const ratio = typeof effect.data?.ratio === "number" ? effect.data.ratio : 0.5
      const healAmount = Math.max(0, Math.floor(attacker.maxHp * ratio))

      if (healAmount <= 0) continue

      const previousHp = attacker.currentHp
      attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + healAmount)
      const recovered = attacker.currentHp - previousHp

      if (recovered > 0) {
        events.push(`${attacker.name} restored ${recovered} HP.`)
      }
      continue
    }

    if (effect.code === "drain") {
      if (damageDealt <= 0) continue

      const ratio = typeof effect.data?.ratio === "number" ? effect.data.ratio : 0.5
      const drainAmount = Math.max(1, Math.floor(damageDealt * ratio))
      const previousHp = attacker.currentHp
      attacker.currentHp = Math.min(attacker.maxHp, attacker.currentHp + drainAmount)
      const recovered = attacker.currentHp - previousHp

      if (recovered > 0) {
        events.push(`${attacker.name} drained ${recovered} HP.`)
      }
      continue
    }

    if (effect.code === "recoil") {
      if (damageDealt <= 0) continue

      const ratio = typeof effect.data?.ratio === "number" ? effect.data.ratio : 0.25
      const recoilAmount = Math.max(1, Math.floor(damageDealt * ratio))
      attacker.currentHp = Math.max(0, attacker.currentHp - recoilAmount)
      events.push(`${attacker.name} was hurt by recoil (${recoilAmount} HP).`)

      if (attacker.currentHp === 0) {
        attacker.fainted = true
        if (hasAvailablePokemon(state, attckerSide)) {
          state.pendingForcedSwitchSide = attckerSide
        }
        events.push(`${attacker.name} has fainted!`)
      }
      continue
    }

    if (effect.code === "stat_changes") {
      const rawChanges = effect.data?.changes
      if (!Array.isArray(rawChanges)) continue

      for (const target of targets) {
        const targetChanges = rawChanges.filter((change) => {
          if (!change || typeof change !== "object") return false
          const typed = change as Record<string, unknown>
          const changeTarget = typed.target

          if (changeTarget === "both") return true
          if (changeTarget === "self") return target === attacker
          if (changeTarget === "target") return target === defender

          return true
        }) as Array<Record<string, unknown>>

        if (targetChanges.length === 0) continue
        applyStatChanges(target, targetChanges, events)
      }
    }
  }
}

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
  const active = current.pokemon[current.activeIndex]
  if (active) {
    active.statStages = { ...DEFAULT_STAT_STAGES }
  }
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

  if (hasAvailablePokemon(state, defenderSide)) {
    state.pendingForcedSwitchSide = defenderSide
  }
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

  applyMoveEffects(attacker, defender, state, side, defenderSide, move, result.damage, events)
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

  const firstSpeed = getEffectiveSpeed(getActivePokemon(state, first.side))
  const secondSpeed = getEffectiveSpeed(getActivePokemon(state, second.side))

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

  if (actor.flinched) {
    actor.flinched = false
    events.push(`${actor.name} flinched and couldn't move!`)
    return
  }

  applyAttack(state, action.side, action.moveIndex, events)
}

function clearTurnVolatileFlags(state: BattleState) {
  state.player.pokemon.forEach((pokemon) => {
    pokemon.flinched = false
  })

  state.ai.pokemon.forEach((pokemon) => {
    pokemon.flinched = false
  })
}

function forceAiSwitchIfFainted(state: BattleState, events: string[]) {
  if (state.winner) return

  const activeAiPokemon = getActivePokemon(state, "ai")
  if (!isPokemonFainted(activeAiPokemon)) return

  const availableSwitches = getAvailableSwitchIndexes(state, "ai")
  if (availableSwitches.length === 0) return

  const randomIndex = Math.floor(Math.random() * availableSwitches.length)
  const toIndex = availableSwitches[randomIndex]
  const previousAiIndex = state.ai.activeIndex
  applySwitch(state, "ai", toIndex, events)

  if (state.ai.activeIndex !== previousAiIndex && state.pendingForcedSwitchSide === "ai") {
    state.pendingForcedSwitchSide = null
  }
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

    if(state.pendingForcedSwitchSide) {
      break
    }
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

    if (!hasAvailablePokemon(state, "player")) {
      setWinner(state, "ai", events)
      break
    }

    if (!hasAvailablePokemon(state, "ai")) {
      setWinner(state, "player", events)
      break
    }

    if(state.pendingForcedSwitchSide) {
      break
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