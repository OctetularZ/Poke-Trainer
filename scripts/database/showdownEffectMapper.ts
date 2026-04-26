import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

type MoveEffectTarget = "self" | "target" | "both" | "field"
type MoveStat =
  | "attack"
  | "defense"
  | "specialAttack"
  | "specialDefense"
  | "speed"
  | "accuracy"
  | "evasion"

type ShowdownBoosts = Partial<Record<"atk" | "def" | "spa" | "spd" | "spe" | "accuracy" | "evasion", number>>

type ShowdownSecondary = {
  chance?: number
  status?: string
  volatileStatus?: string
  boosts?: ShowdownBoosts
  self?: {
    boosts?: ShowdownBoosts
  }
}

type ShowdownMove = {
  name?: string
  desc?: string
  target?: string
  flags?: Record<string, number>
  status?: string
  boosts?: ShowdownBoosts
  self?: {
    boosts?: ShowdownBoosts
    volatileStatus?: string
  }
  volatileStatus?: string
  sideCondition?: string
  weather?: string
  pseudoWeather?: string
  recoil?: [number, number]
  drain?: [number, number]
  selfSwitch?: boolean | string
  secondary?: ShowdownSecondary | null
  secondaries?: ShowdownSecondary[]
  multihit?: number | [number, number]
  willCrit?: boolean
  critRatio?: number
  forceSwitch?: boolean
  condition?: Record<string, unknown>
}

export type NormalizedEffect = {
  code: string
  chance: number | null
  target: MoveEffectTarget | null
  data: Record<string, unknown> | null
}

export type ShowdownMappingResult = {
  mapped: boolean
  effectList: NormalizedEffect[]
  effectCode: string | null
  effectChance: number | null
  effectTarget: MoveEffectTarget | null
  effectData: Record<string, unknown> | null
}

const EMPTY_RESULT: ShowdownMappingResult = {
  mapped: false,
  effectList: [],
  effectCode: null,
  effectChance: null,
  effectTarget: null,
  effectData: null,
}

// Map showdown's stat abbreviations to full names
const STAT_KEY_MAP: Record<string, MoveStat> = {
  atk: "attack",
  def: "defense",
  spa: "specialAttack",
  spd: "specialDefense",
  spe: "speed",
  accuracy: "accuracy",
  evasion: "evasion",
}

// Normalises names for consistency
export function toMoveId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "")
}

export async function loadShowdownMovesIndex(filePath = "scraping/moves.json") {
  const fullPath = resolve(process.cwd(), filePath)
  const raw = await readFile(fullPath, "utf8")
  const parsed = JSON.parse(raw) as Record<string, ShowdownMove>

  const index = new Map<string, ShowdownMove>()

  for (const [key, move] of Object.entries(parsed)) {
    index.set(toMoveId(key), move)

    if (move.name) {
      index.set(toMoveId(move.name), move)
    }
  }

  return index
}

// Converts showdown abbreviations to full status effect names
function mapStatus(status: string | undefined) {
  switch (status) {
    case "brn":
      return "burn"
    case "psn":
      return "poison"
    case "tox":
      return "badly_poison"
    case "par":
      return "paralysis"
    case "slp":
      return "sleep"
    case "frz":
      return "freeze"
    default:
      return null
  }
}

// Groups Showdown targets to broader descriptions
function mapTarget(target: string | undefined): MoveEffectTarget {
  if (!target) return "target"

  if (target === "self") return "self"

  if (
    target === "allySide" ||
    target === "foeSide" ||
    target === "all" ||
    target === "allAdjacent" ||
    target === "allAdjacentFoes"
  ) {
    return "field"
  }

  return "target"
}

// Converts Showdown stat boots to a more consistent effect format
function mapBoosts(boosts: ShowdownBoosts | undefined, target: MoveEffectTarget, chance: number | null) {
  if (!boosts) return null

  const changes = Object.entries(boosts)
    .filter(([, value]) => typeof value === "number" && value !== 0)
    .map(([key, value]) => ({
      stat: STAT_KEY_MAP[key],
      stages: Math.abs(value as number),
      direction: (value as number) > 0 ? "up" : "down",
      target,
    }))
    .filter((change) => Boolean(change.stat))

  if (changes.length === 0) return null

  return {
    code: "stat_changes",
    chance,
    target: null,
    data: { changes },
  } as NormalizedEffect
}

// Handles volatile effects separaretly
function mapVolatileStatus(volatileStatus: string | undefined, chance: number | null, target: MoveEffectTarget) {
  if (!volatileStatus) return null

  if (volatileStatus === "flinch") {
    return {
      code: "flinch",
      chance,
      target,
      data: null,
    } as NormalizedEffect
  }

  if (volatileStatus === "confusion") {
    return {
      code: "confuse",
      chance,
      target,
      data: null,
    } as NormalizedEffect
  }

  return {
    code: "volatile_apply",
    chance,
    target,
    data: { volatileStatus },
  } as NormalizedEffect
}

function addEffect(effects: NormalizedEffect[], effect: NormalizedEffect | null) {
  if (!effect) return
  effects.push(effect)
}

// Remove duplicates effect as Showdown can store the same effect in multiple fields
function dedupeEffects(effects: NormalizedEffect[]) {
  const seen = new Set<string>()

  return effects.filter((effect) => {
    const key = JSON.stringify(effect)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// Store raw data for moves which couldn't be mapped so they are not lost.
function buildShowdownRawData(move: ShowdownMove, moveId: string) {
  const data: Record<string, unknown> = {
    moveId,
    target: move.target ?? null,
    flags: move.flags ?? null,
  }

  const optionalKeys: Array<keyof ShowdownMove> = [
    "status",
    "boosts",
    "self",
    "volatileStatus",
    "sideCondition",
    "weather",
    "pseudoWeather",
    "recoil",
    "drain",
    "selfSwitch",
    "secondary",
    "secondaries",
    "multihit",
    "willCrit",
    "critRatio",
    "forceSwitch",
    "condition",
  ]

  for (const key of optionalKeys) {
    const value = move[key]
    if (value !== undefined) {
      data[key] = value as unknown
    }
  }

  return data
}

/**
 * Converts Pokémon Showdown move data into a simplified internal effect format.
 * 
 * This was done so I could store them into my database in a preferrable format.
 */

export function mapShowdownMoveEffects(move: ShowdownMove): ShowdownMappingResult {
  const effects: NormalizedEffect[] = []
  const target = mapTarget(move.target)
  const moveId = toMoveId(move.name ?? "")

  const baseStatus = mapStatus(move.status)
  if (baseStatus) {
    addEffect(effects, {
      code: "status_apply",
      chance: 100,
      target,
      data: { status: baseStatus },
    })
  }

  addEffect(effects, mapBoosts(move.boosts, target, 100))
  addEffect(effects, mapBoosts(move.self?.boosts, "self", 100))

  addEffect(effects, mapVolatileStatus(move.volatileStatus, 100, target))
  addEffect(effects, mapVolatileStatus(move.self?.volatileStatus, 100, "self"))

  if (move.recoil && move.recoil[1]) {
    addEffect(effects, {
      code: "recoil",
      chance: 100,
      target: "self",
      data: { ratio: move.recoil[0] / move.recoil[1] },
    })
  }

  if (move.drain && move.drain[1]) {
    addEffect(effects, {
      code: "drain",
      chance: 100,
      target: "self",
      data: { ratio: move.drain[0] / move.drain[1] },
    })
  }

  if (move.selfSwitch) {
    addEffect(effects, {
      code: "switch_out",
      chance: 100,
      target: "self",
      data: { mode: move.selfSwitch === true ? "normal" : String(move.selfSwitch) },
    })
  }

  if (move.sideCondition) {
    addEffect(effects, {
      code: "side_condition",
      chance: 100,
      target: "field",
      data: { sideCondition: move.sideCondition },
    })
  }

  if (move.weather || move.pseudoWeather) {
    addEffect(effects, {
      code: "field_effect",
      chance: 100,
      target: "field",
      data: {
        weather: move.weather ?? null,
        pseudoWeather: move.pseudoWeather ?? null,
      },
    })
  }

  if (move.flags?.charge) {
    // Solar beam and blade handled separarelty as they are unique
    const isSolarMove = moveId === "solarbeam" || moveId === "solarblade"

    addEffect(effects, {
      code: "two_turn_charge",
      chance: 100,
      target: "self",
      data: isSolarMove
        ? {
            requiresChargeTurn: true,
            skipsChargeInWeather: ["sunnyday", "desolateland"],
            powerHerbSkipsCharge: true,
            weatherPowerModifier: {
              weathers: ["raindance", "primordialsea", "sandstorm", "snow"],
              multiplier: 0.5,
            },
          }
        : {
            requiresChargeTurn: true,
            powerHerbSkipsCharge: true,
          },
    })
  }

  if (move.forceSwitch) {
    addEffect(effects, {
      code: "force_switch",
      chance: 100,
      target,
      data: null,
    })
  }

  if (move.multihit !== undefined) {
    addEffect(effects, {
      code: "multi_hit",
      chance: 100,
      target,
      data: { multihit: move.multihit },
    })
  }

  if (move.willCrit) {
    addEffect(effects, {
      code: "always_crit",
      chance: 100,
      target,
      data: null,
    })
  }

  if (typeof move.critRatio === "number" && move.critRatio > 1) {
    addEffect(effects, {
      code: "high_crit_ratio",
      chance: 100,
      target,
      data: { critRatio: move.critRatio },
    })
  }

  if (move.flags?.heal) {
    addEffect(effects, {
      code: "heal_move",
      chance: 100,
      target: "self",
      data: null,
    })
  }

  if (move.flags?.reflectable) {
    addEffect(effects, {
      code: "reflectable",
      chance: 100,
      target: "field",
      data: null,
    })
  }

  if (move.flags?.bypasssub) {
    addEffect(effects, {
      code: "bypass_substitute",
      chance: 100,
      target,
      data: null,
    })
  }

  if (move.flags?.contact) {
    addEffect(effects, {
      code: "contact",
      chance: 100,
      target,
      data: null,
    })
  }

  if (move.flags?.sound) {
    addEffect(effects, {
      code: "sound_move",
      chance: 100,
      target,
      data: null,
    })
  }

  if (move.flags?.punch) {
    addEffect(effects, {
      code: "punch_move",
      chance: 100,
      target,
      data: null,
    })
  }

  if (move.flags?.bite) {
    addEffect(effects, {
      code: "bite_move",
      chance: 100,
      target,
      data: null,
    })
  }

  if (move.flags?.slicing) {
    addEffect(effects, {
      code: "slicing_move",
      chance: 100,
      target,
      data: null,
    })
  }

  if (move.flags?.powder) {
    addEffect(effects, {
      code: "powder_move",
      chance: 100,
      target,
      data: null,
    })
  }

  if (move.flags?.wind) {
    addEffect(effects, {
      code: "wind_move",
      chance: 100,
      target,
      data: null,
    })
  }

  if (move.flags?.pulse) {
    addEffect(effects, {
      code: "pulse_move",
      chance: 100,
      target,
      data: null,
    })
  }

  if (move.flags?.bullet) {
    addEffect(effects, {
      code: "bullet_move",
      chance: 100,
      target,
      data: null,
    })
  }

  if (move.condition) {
    addEffect(effects, {
      code: "timed_condition",
      chance: 100,
      target: "field",
      data: { condition: move.condition },
    })
  }

  // Process secondary effect as they have their own chance values
  const allSecondaries = [move.secondary, ...(move.secondaries ?? [])].filter(Boolean) as ShowdownSecondary[]
  for (const secondary of allSecondaries) {
    const chance = secondary.chance ?? null

    const secondaryStatus = mapStatus(secondary.status)
    if (secondaryStatus) {
      addEffect(effects, {
        code: "status_apply",
        chance,
        target,
        data: { status: secondaryStatus },
      })
    }

    addEffect(effects, mapVolatileStatus(secondary.volatileStatus, chance, target))
    addEffect(effects, mapBoosts(secondary.boosts, target, chance))
    addEffect(effects, mapBoosts(secondary.self?.boosts, "self", chance))
  }

  let effectList = dedupeEffects(effects)

  // Fallback to raw showdown data
  if (effectList.length === 0) {
    effectList = [
      {
        code: "showdown_raw",
        chance: 100,
        target: null,
        data: buildShowdownRawData(move, moveId),
      },
    ]
  }

  const primary = effectList[0]

  return {
    mapped: true,
    effectList,
    effectCode: primary.code,
    effectChance: primary.chance,
    effectTarget: primary.target,
    effectData: primary.data,
  }
}
