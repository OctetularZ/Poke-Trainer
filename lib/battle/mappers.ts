import { TeamMember } from "@/types/team"
import { BattleEffect, BattleMove, BattlePokemon } from "./types"

const DEFAULT_LEVEL = 100
const DEFAULT_IV = 31

/* 
These functions map Pokémon fetched from the database to Battle Pokémon/Teams to be used in battle engine
*/

const natureEffects: Record<
  string,
  {
    increases: "attack" | "defense" | "specialAttack" | "specialDefense" | "speed" | "none"
    decreases: "attack" | "defense" | "specialAttack" | "specialDefense" | "speed" | "none"
  }
> = {
  Hardy: { increases: "none", decreases: "none" },
  Docile: { increases: "none", decreases: "none" },
  Serious: { increases: "none", decreases: "none" },
  Bashful: { increases: "none", decreases: "none" },
  Quirky: { increases: "none", decreases: "none" },
  Lonely: { increases: "attack", decreases: "defense" },
  Brave: { increases: "attack", decreases: "speed" },
  Adamant: { increases: "attack", decreases: "specialAttack" },
  Naughty: { increases: "attack", decreases: "specialDefense" },
  Bold: { increases: "defense", decreases: "attack" },
  Relaxed: { increases: "defense", decreases: "speed" },
  Impish: { increases: "defense", decreases: "specialAttack" },
  Lax: { increases: "defense", decreases: "specialDefense" },
  Timid: { increases: "speed", decreases: "attack" },
  Hasty: { increases: "speed", decreases: "defense" },
  Jolly: { increases: "speed", decreases: "specialAttack" },
  Naive: { increases: "speed", decreases: "specialDefense" },
  Modest: { increases: "specialAttack", decreases: "attack" },
  Mild: { increases: "specialAttack", decreases: "defense" },
  Quiet: { increases: "specialAttack", decreases: "speed" },
  Rash: { increases: "specialAttack", decreases: "specialDefense" },
  Calm: { increases: "specialDefense", decreases: "attack" },
  Gentle: { increases: "specialDefense", decreases: "defense" },
  Sassy: { increases: "specialDefense", decreases: "speed" },
  Careful: { increases: "specialDefense", decreases: "specialAttack" },
}

function toBattleCategory(category: string): BattleMove["category"] {
  const normalized = category.toLowerCase()

  if (normalized === "physical" || normalized === "special" || normalized === "status") {
    return normalized
  }

  return "physical"
}

function toNullableNumber(value: string | null | undefined): number | null {
  if (value == null) return null

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function toEffectTarget(value: string | null | undefined): BattleEffect["target"] {
  if (!value) return null

  if (value === "self" || value === "target" || value === "both" || value === "field") {
    return value
  }

  return null
}

function toEffectData(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

function toEffectList(value: unknown): BattleEffect[] | undefined {
  if (!Array.isArray(value)) return undefined

  const effects = value
    .filter((item) => item && typeof item === "object" && !Array.isArray(item))
    .map((item) => {
      const raw = item as Record<string, unknown>

      const code = typeof raw.code === "string" ? raw.code : null
      if (!code) return null

      const chance = typeof raw.chance === "number" ? raw.chance : null
      const target = toEffectTarget(typeof raw.target === "string" ? raw.target : null)
      const data = toEffectData(raw.data)

      return {
        code,
        chance,
        target,
        data,
      } as BattleEffect
    })
    .filter(Boolean) as BattleEffect[]

  return effects.length > 0 ? effects : undefined
}

function getNatureMultiplier(
  nature: string | undefined,
  stat: "attack" | "defense" | "specialAttack" | "specialDefense" | "speed",
) {
  if (!nature) return 1

  const effect = natureEffects[nature]
  if (!effect) return 1
  if (effect.increases === stat) return 1.1
  if (effect.decreases === stat) return 0.9

  return 1
}

function calcHpStat(baseHp?: number, evHp: number = 0, level: number = DEFAULT_LEVEL) {
  const safeBaseHp = baseHp ?? 80
  const clampedEv = Math.max(0, evHp)

  return (
    Math.floor(((2 * safeBaseHp + DEFAULT_IV + Math.floor(clampedEv / 4)) * level) / 100) +
    level +
    10
  )
}

function calcNonHpStat(
  baseStat: number | undefined,
  ev: number = 0,
  stat: "attack" | "defense" | "specialAttack" | "specialDefense" | "speed",
  nature: string | undefined,
  level: number = DEFAULT_LEVEL,
) {
  const safeBaseStat = baseStat ?? 80
  const clampedEv = Math.max(0, ev)
  const neutral =
    Math.floor(((2 * safeBaseStat + DEFAULT_IV + Math.floor(clampedEv / 4)) * level) / 100) + 5
  const natureMultiplier = getNatureMultiplier(nature, stat)

  return Math.floor(neutral * natureMultiplier)
}

export function mapTeamMemberMoveToBattleMove(memberMove: TeamMember["moves"][number]): BattleMove {
  const move = memberMove.gameMove.move

  return {
    id: move.id,
    name: move.name,
    type: move.type,
    category: toBattleCategory(move.category),
    power: toNullableNumber(move.power),
    accuracy: toNullableNumber(move.accuracy),
    remainingPP: toNullableNumber(move.pp),
    maxPP: toNullableNumber(move.pp),
    priority: toNullableNumber(move.priority),
    effect: move.effect ?? "",
    description: move.description ?? "",
    effectCode: move.effectCode ?? undefined,
    effectChance: move.effectChance ?? undefined,
    effectTarget: move.effectTarget ?? undefined,
    effectData: move.effectData ?? undefined,
    effectList: toEffectList(move.effectList),
    target: move.target ?? "",
    contact: move.contact ?? ""
  }
}

// Converts Team Members to Battle Pokémon
export function mapTeamMemberToBattlePokemon(member: TeamMember): BattlePokemon {
  const level = DEFAULT_LEVEL
  const maxHp = calcHpStat(member.pokemon.hpBase, member.evHp, level)

  return {
    id: member.pokemon.id,
    name: member.pokemon.name,
    level,
    currentHp: maxHp,
    maxHp,
    attack: calcNonHpStat(
      member.pokemon.attackBase,
      member.evAtk,
      "attack",
      member.nature,
      level,
    ),
    defense: calcNonHpStat(
      member.pokemon.defenseBase,
      member.evDef,
      "defense",
      member.nature,
      level,
    ),
    specialAttack: calcNonHpStat(
      member.pokemon.spAtkBase,
      member.evSpAtk,
      "specialAttack",
      member.nature,
      level,
    ),
    specialDefense: calcNonHpStat(
      member.pokemon.spDefBase,
      member.evSpDef,
      "specialDefense",
      member.nature,
      level,
    ),
    speed: calcNonHpStat(
      member.pokemon.speedBase,
      member.evSpeed,
      "speed",
      member.nature,
      level,
    ),
    types: (member.pokemon.types ?? []).map((type) => type.name.toLowerCase()),
    moves: [...member.moves]
      .sort((a, b) => a.slot - b.slot)
      .map((move) => mapTeamMemberMoveToBattleMove(move)),
    fainted: false,
    status: null,
    flinched: false,
    statStages: {
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
      accuracy: 0,
      evasion: 0,
    },
    sprites: member.pokemon.sprites,
    sleepTurnsElapsed: 0
  }
}

export function mapTeamMembersToBattlePokemon(members: TeamMember[]): BattlePokemon[] {
  return [...members]
    .sort((a, b) => a.slot - b.slot)
    .map((member) => mapTeamMemberToBattlePokemon(member))
}
