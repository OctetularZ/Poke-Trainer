import { TeamMember } from "@/types/team"
import { BattleMove, BattlePokemon } from "./types"

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

function calcMaxHp(baseHp?: number) {
  const safeBaseHp = baseHp ?? 80
  return Math.floor(((2 * safeBaseHp) * 50) / 100) + 60
}

function calcStat(baseStat?: number) {
  const safeBaseStat = baseStat ?? 80
  return Math.floor(((2 * safeBaseStat) * 50) / 100) + 5
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
  const maxHp = calcMaxHp(member.pokemon.hpBase)

  return {
    id: member.pokemon.id,
    name: member.pokemon.name,
    level: 50,
    currentHp: maxHp,
    maxHp,
    attack: calcStat(member.pokemon.attackBase),
    defense: calcStat(member.pokemon.defenseBase),
    specialAttack: calcStat(member.pokemon.spAtkBase),
    specialDefense: calcStat(member.pokemon.spDefBase),
    speed: calcStat(member.pokemon.speedBase),
    types: (member.pokemon.types ?? []).map((type) => type.name.toLowerCase()),
    moves: [...member.moves]
      .sort((a, b) => a.slot - b.slot)
      .map((move) => mapTeamMemberMoveToBattleMove(move)),
    fainted: false,
  }
}

export function mapTeamMembersToBattlePokemon(members: TeamMember[]): BattlePokemon[] {
  return [...members]
    .sort((a, b) => a.slot - b.slot)
    .map((member) => mapTeamMemberToBattlePokemon(member))
}
