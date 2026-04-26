// This was my original approach to finding what move effects did for each move.
// Luckily, I managed to find pokemon showdowns json version which helped out TREMENDOUSLY and saved me hours of coding

// This file doesn't need to commented but left here for later use. This was not used for this submitted project.

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

type StatChange = {
  stat: MoveStat
  stages: number
  direction: "up" | "down"
  target: MoveEffectTarget
}

export interface EffectMappingResult {
  effectCode: string | null,
  effectChance: number | null,
  effectTarget: MoveEffectTarget| null
  effectData: Record<string, unknown> | null
  mapped: boolean
}

const EMPTY_RESULT: EffectMappingResult = {
  effectCode: null,
  effectChance: null,
  effectTarget: null,
  effectData: null,
  mapped: false,
}

const statPatterns: Array<{ stat: MoveStat; regex: RegExp }> = [
  { stat: "specialAttack", regex: /\b(special attack|sp\.?\s*atk|spatk)\b/ },
  { stat: "specialDefense", regex: /\b(special defense|sp\.?\s*def|spdef)\b/ },
  { stat: "attack", regex: /\battack\b/ },
  { stat: "defense", regex: /\bdefense\b/ },
  { stat: "speed", regex: /\bspeed\b/ },
  { stat: "accuracy", regex: /\baccuracy\b/ },
  { stat: "evasion", regex: /\bevasion\b/ },
]

export function mapMoveEffect(effectText?: string | null) : EffectMappingResult {
  const effect = normaliseMoveEffect(effectText)

  if (!effect || /no additional effect/.test(effect)) {
    return EMPTY_RESULT
  }

  const chance = detectChance(effect)

  return (
    mapStatusEffect(effect, chance) ??
    mapStatStageEffect(effect, chance) ??
    mapSelfHealEffect(effect) ??
    mapDrainEffect(effect) ??
    mapRecoilEffect(effect) ??
    mapFlinchEffect(effect, chance) ??
    EMPTY_RESULT
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

// Detecting all stat names found in the same clause.
function detectAllStats(text: string): MoveStat[] {
  const found = statPatterns
    .filter(({ regex }) => regex.test(text))
    .map(({ stat }) => stat)

  return Array.from(new Set(found))
}

function detectStatTarget(clause: string, direction: "up" | "down"): MoveEffectTarget {
  if (/\b(user|itself|its own)\b/.test(clause)) return "self"
  if (/\b(target|opponent|enemy|foe)\b/.test(clause)) return "target"

  // For omitted targets in effect text, boosts are typically self and drops are typically target.
  return direction === "up" ? "self" : "target"
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
  const changes: StatChange[] = []

  const upRegex = /\b(raise|raises|boost|boosts|increase|increases)\b([^.]*)/g
  const downRegex = /\b(lower|lowers|drop|drops|decrease|decreases|reduce|reduces)\b([^.]*)/g

  let upMatch: RegExpExecArray | null
  while ((upMatch = upRegex.exec(effect)) !== null) {
    const clause = `${upMatch[1]} ${upMatch[2]}`.trim()
    const stats = detectAllStats(clause)
    if (stats.length === 0) continue

    const stages = detectStages(clause)
    const target = detectStatTarget(clause, "up")

    for (const stat of stats) {
      changes.push({ stat, stages, direction: "up", target })
    }
  }

  let downMatch: RegExpExecArray | null
  while ((downMatch = downRegex.exec(effect)) !== null) {
    const clause = `${downMatch[1]} ${downMatch[2]}`.trim()
    const stats = detectAllStats(clause)
    if (stats.length === 0) continue

    const stages = detectStages(clause)
    const target = detectStatTarget(clause, "down")

    for (const stat of stats) {
      changes.push({ stat, stages, direction: "down", target })
    }
  }

  if (changes.length === 0) return null

  return {
    effectCode: "stat_changes",
    effectChance: chance,
    effectTarget: null,
    effectData: { changes },
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
