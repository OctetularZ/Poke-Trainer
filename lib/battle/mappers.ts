import { TeamMember } from "@/types/team"
import { BattleMove, BattlePokemon } from "./types"

const DEFAULT_LEVEL = 100
const DEFAULT_IV = 31

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
  }
}

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
    sprites: member.pokemon.sprites,
  }
}

export function mapTeamMembersToBattlePokemon(members: TeamMember[]): BattlePokemon[] {
  return [...members]
    .sort((a, b) => a.slot - b.slot)
    .map((member) => mapTeamMemberToBattlePokemon(member))
}
