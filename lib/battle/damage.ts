import { BattleMove, BattlePokemon, DamageResult } from "./types"
import { getTypeMultiplier } from "./type-chart"

const CRIT_CHANCE = 1 / 24

function randomRoll(max: number) {
  return Math.floor(Math.random() * max) + 1
}

// Gets the stat stages for Pokémon if any
function statStageMultiplier(stage: number) {
  if (stage >= 0) {
    return (2 + stage) / 2
  }

  return 2 / (2 - stage)
}

// Calculates damage for attacker Pokémon moves on defender Pokémon
export function calculateDamage(
  attacker: BattlePokemon,
  defender: BattlePokemon,
  move: BattleMove,
): DamageResult {
  if (!move.power || move.category === "status") {
    return {
      damage: 0,
      wasCritical: false,
      typeMultiplier: 1,
      hit: true,
    }
  }

  // Determines whether move will hit or miss
  const hit = move.accuracy == null ? true : randomRoll(100) <= move.accuracy

  if (!hit) {
    return {
      damage: 0,
      wasCritical: false,
      typeMultiplier: 1,
      hit: false,
    }
  }

  // Special, Status, Physical moves are handled differently as they use different stats.
  const isSpecial = move.category === "special"
  const attackStage = isSpecial
    ? attacker.statStages?.specialAttack ?? 0
    : attacker.statStages?.attack ?? 0
  const defenseStage = isSpecial
    ? defender.statStages?.specialDefense ?? 0
    : defender.statStages?.defense ?? 0

  const attackStatBase = isSpecial ? attacker.specialAttack : attacker.attack
  const defenseStatBase = isSpecial ? defender.specialDefense : defender.defense

  const attackStat = Math.max(1, Math.floor(attackStatBase * statStageMultiplier(attackStage)))
  const defenseStat = Math.max(1, Math.floor(defenseStatBase * statStageMultiplier(defenseStage)))

  // Accounts for possible critical hits
  const crit = Math.random() < CRIT_CHANCE
  const critMultiplier = crit ? 1.5 : 1

  const stab = attacker.types.some((type) => type.toLowerCase() === move.type.toLowerCase())
    ? 1.5
    : 1

  // Factors in type multipliers
  const typeMultiplier = getTypeMultiplier(move.type, defender.types)
  const randomFactor = 0.85 + Math.random() * 0.15

  const baseDamage =
    (((2 * attacker.level) / 5 + 2) * move.power * (attackStat / Math.max(1, defenseStat))) /
      50 +
    2

  const finalDamage = Math.max(
    1,
    Math.floor(baseDamage * critMultiplier * stab * typeMultiplier * randomFactor),
  )

  return {
    damage: finalDamage,
    wasCritical: crit,
    typeMultiplier,
    hit: true,
  }
}
