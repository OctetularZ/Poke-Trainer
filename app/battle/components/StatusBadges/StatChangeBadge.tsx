import { BattleStatStages } from "@/lib/battle"
import React from "react"

interface StatChangeBadgeProps {
  stat: string
  stage: number
}

const statMapper: Record<string, string> = {
  attack: "ATK",
  defense: "DEF",
  specialAttack: "SPA",
  specialDefense: "SPD",
  speed: "SPE",
}

const StatChangeBadge = ({ stat, stage }: StatChangeBadgeProps) => {
  return (
    <div
      className={`items-center rounded-sm px-2 shadow-xs/50 shadow-black border-1 ${stage < 0 ? "bg-red-300 border-red-800" : "bg-emerald-300 border-emerald-800"}`}
    >
      <h1
        className={`text-center leading-none text-shadow-black text-shadow-xs ${stage < 0 ? "text-red-800" : "text-emerald-800"}`}
      >
        {`${stage * 0.5}x ${statMapper[stat]}`}
      </h1>
    </div>
  )
}

export default StatChangeBadge
