type MoveEffectTarget = "self" | "target" | "both" | "field"
type MoveStatus = "burn" | "poison" | "paralysis" | "sleep" | "freeze"
type MoveStat = 
"attack" 
| "defense" 
| "specialAttack" 
| "specialDefense" 
| "speed"
| "accuracy"
| "evasion"

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
    mapStatusEffect(effect, chance) ??
    mapStatStageEffect(effect, chance) ??
    mapSelfHealEffect(effect) ??
    mapDrainEffect(effect) ??
    mapRecoilEffect(effect) ??
    mapFlinchEffect(effect, chance) ??
    {
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
  // Replacing text fractions slashes (i.e. 1⁄3) with regular slashes
  .replace(/[⁄]/g, "/")
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

function detectTarget(effect: string): MoveEffectTarget {
  if (/\b(user|itself|its own)\b/.test(effect)) return "self"
  if (/all pokemon|both pokemon|everyone/.test(effect)) return "both"
  if (/field|weather|terrain|room/.test(effect)) return "field"
  return "target"
}

// Detecting status effects
function detectStatus(effect: string): MoveStatus | null {
  if (/\bburn\w*\b/.test(effect)) return "burn"
  if (/\bpoison\w*\b/.test(effect)) return "poison"
  if (/\bparalyz\w*\b/.test(effect)) return "paralysis"
  if (/\bsleep\w*\b/.test(effect)) return "sleep"
  if (/\b(freeze|freezes|frozen|freezing)\b/.test(effect)) return "freeze"
  return null
}

// Detecting increases/decreases to stat effect
function detectStat(effect: string): MoveStat | null {
  if (/special attack|sp\.?\s*atk|spatk/.test(effect)) return "specialAttack"
  if (/special defense|sp\.?\s*def|spdef/.test(effect)) return "specialDefense"
  if (/\battack\b/.test(effect)) return "attack"
  if (/\bdefense\b/.test(effect)) return "defense"
  if (/\bspeed\b/.test(effect)) return "speed"
  if (/\baccuracy\b/.test(effect)) return "accuracy"
  if (/\bevasion\b/.test(effect)) return "evasion"
  return null
}

function detectStages(effect: string): number {
  if (/sharply/.test(effect)) return 2
  if (/drastically/.test(effect)) return 3

  const explicit = effect.match(/by (\d+) stages?/)
  if (!explicit) return 1

  const parsed = Number(explicit[1])
  if (!Number.isFinite(parsed)) return 1
  return Math.max(1, Math.min(6, parsed))
}

function mapStatStageEffect(effect: string, chance: number | null): EffectMappingResult | null {
  const stat = detectStat(effect)
  if(!stat) return null

  const isRaise = /\b(raise|raises|boost|boosts|increase|increases)\b/.test(effect)
  const isLower = /\b(lower|lowers|drop|drops|decrease|decreases|reduce|reduces)\b/.test(effect)
  if (!isRaise && !isLower) return null

  return {
    effectCode: isRaise ? "stat_up" : "stat_down",
    effectChance: chance,
    effectTarget: detectTarget(effect),
    effectData: { stat, stages: detectStages(effect) },
    mapped: true,
  }
}

// Detecting self-healing moves
function mapSelfHealEffect(effect: string): EffectMappingResult | null {
  if (/\b(drain|damage dealt|dealt)\b/.test(effect)) return null

  const isSelfHealingText =
    /\b(recovers?|restores?|heals?)\b/.test(effect) &&
    /\b(user|itself|its own|hp)\b/.test(effect)
  
  if (!isSelfHealingText) return null

  let ratio = 0.5
  if (/(quarter|1\/4|25%)/.test(effect)) ratio = 0.25
  if (/(half|1\/2|50%)/.test(effect)) ratio = 0.5
  if (/(two-thirds|2\/3|66%)/.test(effect)) ratio = 2 / 3
  if (/(full|fully|100%|all hp)/.test(effect)) ratio = 1

  return {
    effectCode: "heal_self",
    effectChance: 100,
    effectTarget: "self",
    effectData: { ratio },
    mapped: true,
  }
}

// Detecting drain move effects
function mapDrainEffect(effect: string): EffectMappingResult | null {
  const isDrainText =
    /\b(drain|drains)\b/.test(effect) ||
    /\bdamage dealt\b/.test(effect) ||
    /\bdealt is restored\b/.test(effect)

  if (!isDrainText) return null

  let ratio = 0.5
  if (/(three-quarters|3\/4|75%)/.test(effect)) ratio = 0.75
  if (/all the damage|100%/.test(effect)) ratio = 1

  return {
    effectCode: "drain",
    effectChance: 100,
    effectTarget: "self",
    effectData: { ratio },
    mapped: true
  }
}

// Detecting recoil move effects
function mapRecoilEffect(effect: string): EffectMappingResult | null {
  if (!/\brecoil\b/.test(effect)) return null

  let ratio = 0.25
  if (/half|50%/.test(effect)) ratio = 0.5
  if (/(one-third|1\/3|33%)/.test(effect)) ratio = 1 / 3

  return {
    effectCode: "recoil",
    effectChance: 100,
    effectTarget: "self",
    effectData: {ratio},
    mapped: true
  }
}

// Detecting flinch move effects
function mapFlinchEffect(effect: string, chance: number | null): EffectMappingResult | null {
  if (!/\bflinch\w*\b/.test(effect)) return null

  return {
    effectCode: "flinch",
    effectChance: chance ?? null,
    effectTarget: "target",
    effectData: null,
    mapped: true,
  }
}
