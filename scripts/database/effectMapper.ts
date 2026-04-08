import { effect } from "better-auth/react"

type MoveEffectTarget = "self" | "target" | "both" | "field"
type MoveStatus = "burn" | "poison" | "paralysis" | "sleep" | "freeze"

export interface EffectMappingResult {
  effectCode: string | null,
  effectChance: number | null,
  effectTarget: MoveEffectTarget| null
  effectData: Record<string, unknown> | null
  mapped: boolean
}

export function mapMoveEffect(effectText?: string | null) : EffectMappingResult {
  const effect = normaliseMoveEffect(effectText)

  if (!effect || /no additional effect/.test(effect)) {
    return {
    effectCode: null,
    effectChance: null,
    effectTarget: null,
    effectData: null,
    mapped: false,
    }
  }

  const chance = detectChance(effect)

  return (
    mapStatusEffect(effect, chance) ?? {
      effectCode: null,
      effectChance: null,
      effectTarget: null,
      effectData: null,
      mapped: false
    }
  )
}

function mapStatusEffect(effect: string, chance: number | null): EffectMappingResult | null {
  const status = detectStatus(effect)
  if (!status) return null

  const isGuaranteed = /\b(burns|poisons|paralyzes|freezes|puts)\b/.test(effect)

  return {
    effectCode: "status_apply",
    effectChance: chance ?? (isGuaranteed ? 100 : null),
    effectTarget: detectTarget(effect),
    effectData: {status},
    mapped: true
  }
}

function normaliseMoveEffect(effectText?: string | null) {
  if (!effectText) return ""

  return effectText
  // Converting any curly apostrophes to regular ones -  not sure if there is any in the DB but added for safety.
  .replace(/[\u2018\u2019]/g, "'")
  // Reduce new lines or multiple spaces into one
  .replace(/\s+/g, " ")
  // Remove blank spaces at start and end of string
  .trim()
  // Make whole text lowercase
  .toLowerCase()
}

function detectChance(effect: string): number | null {
  const match =
    effect.match(/(\d{1,3})%\s*chance/) ||
    effect.match(/has a\s+(\d{1,3})%\s*chance/) ||
    effect.match(/(\d{1,3})%\s*of the time/)

  if (!match) return null

  const value = Number(match[1])
  if (!Number.isFinite(value)) return null

  return Math.max(0, Math.min(100, value))
}

function detectStatus(effect: string): MoveStatus | null {
  if (/burn/.test(effect)) return "burn"
  if (/poison/.test(effect)) return "poison"
  if (/paralyz/.test(effect)) return "paralysis"
  if (/sleep/.test(effect)) return "sleep"
  if (/freez/.test(effect)) return "freeze"
  return null
}

function detectTarget(effect: string): MoveEffectTarget {
  if (/user|itself|its own/.test(effect)) return "self"
  if (/all pokemon|both pokemon|everyone/.test(effect)) return "both"
  if (/field|weather|terrain|room/.test(effect)) return "field"
  return "target"
}