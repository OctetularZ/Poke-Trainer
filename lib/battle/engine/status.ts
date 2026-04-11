import { BattleSide, BattleState } from "../types"
import { getActivePokemon, hasAvailablePokemon, isPokemonFainted } from "./pokemon"

function getResidualDamage(maxHp: number, divisor: number) {
  return Math.max(1, Math.floor(maxHp / divisor))
}

export function applyEndOfTurnStatus(state: BattleState, events: string[]) {
  const sides: BattleSide[] = ["player", "ai"]

  for (const side of sides) {
    const activePokemon = getActivePokemon(state, side)
    if (isPokemonFainted(activePokemon)) continue

    const status = activePokemon.status
    if (!status) continue

    let damage = 0
    let sourceLabel = ""

    if (status === "poison" || status === "badly_poison") {
      damage = getResidualDamage(activePokemon.maxHp, 8)
      sourceLabel = "poison"
    }

    if (status === "burn") {
      damage = getResidualDamage(activePokemon.maxHp, 16)
      sourceLabel = "burn"
    }

    if (damage <= 0) continue

    const previousHp = activePokemon.currentHp
    activePokemon.currentHp = Math.max(0, activePokemon.currentHp - damage)
    const dealt = previousHp - activePokemon.currentHp

    if (dealt > 0) {
      events.push(`${activePokemon.name} was hurt by ${sourceLabel}.`)
    }

    if (activePokemon.currentHp === 0) {
      activePokemon.fainted = true
      events.push(`${activePokemon.name} has fainted!`)

      if (hasAvailablePokemon(state, side)) {
        if (!state.pendingForcedSwitchSide || side === "player") {
          state.pendingForcedSwitchSide = side
        }
      }
    }
  }
}