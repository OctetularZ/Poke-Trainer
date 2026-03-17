import { BattleMove, BattlePokemon, DamageResult } from "./types"
import { getTypeMultiplier } from "./type-chart"

const CRIT_CHANCE = 1 / 24

function randomRoll(max: number) {
  return Math.floor(Math.random() * max) + 1
}

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

  const accuracyCheck = move.accuracy ?? 100
  const hit = randomRoll(100) <= accuracyCheck

  if (!hit) {
    return {
      damage: 0,
      wasCritical: false,
      typeMultiplier: 1,
      hit: false,
    }
  }

  const isSpecial = move.category === "special"
  const attackStat = isSpecial ? attacker.specialAttack : attacker.attack
  const defenseStat = isSpecial ? defender.specialDefense : defender.defense

  const crit = Math.random() < CRIT_CHANCE
  const critMultiplier = crit ? 1.5 : 1

  const stab = attacker.types.some((type) => type.toLowerCase() === move.type.toLowerCase())
    ? 1.5
    : 1

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
