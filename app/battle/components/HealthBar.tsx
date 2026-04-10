import React from "react"
import StatusAilmentBadge from "./StatusBadges/StatusAilmentBadge"
import { BattleStatStages, BattleStatus } from "@/lib/battle"
import StatChangeBadge from "./StatusBadges/StatChangeBadge"

interface HealthBarProps {
  pokemonName: string
  currentHP: number
  maxHP: number
  percentageOnLeft?: boolean
  ailment?: BattleStatus | null
  statChanges: BattleStatStages | undefined
}

const getHpColor = (percentage: number) => {
  if (percentage > 50)
    return "bg-gradient-to-t from-green-800 via-green-500 to-green-300"
  if (percentage > 20) return "bg-yellow-400"
  return "bg-red-500"
}

const HealthBar = ({
  pokemonName,
  currentHP,
  maxHP,
  percentageOnLeft = false,
  ailment,
  statChanges,
}: HealthBarProps) => {
  const percentage = Math.max(0, Math.min(100, (currentHP / maxHP) * 100))
  const roundedPercentage = Math.round(percentage)
  const color = getHpColor(roundedPercentage)

  return (
    <div className="flex flex-col items-start">
      <div className="w-[300px]">
        <h4
          className={`w-[250px] text-center text-black text-3xl font-bold [text-shadow:1px_1px_0_#fff,-1px_1px_0_#fff,1px_-1px_0_#fff,-1px_-1px_0_#fff] ${
            percentageOnLeft ? "ml-auto" : ""
          }`}
        >
          {pokemonName.toUpperCase()}
        </h4>
        <div className="relative w-[300px] h-3">
          {/* Extended background (goes further right) */}
          <div className="absolute inset-y-0 left-0 w-full bg-gray-500 rounded-md" />

          {/* Actual HP bar lane */}
          <div
            className={`absolute inset-y-0 z-10 w-[250px] ${
              percentageOnLeft ? "right-0" : "left-0"
            }`}
          >
            <div className="relative h-full border-t-1 border-t-white bg-white border-b-1 border-b-white border-x-1 border-x-white rounded-md overflow-hidden">
              <div className="absolute inset-0 border border-neutral-500 rounded-md pointer-events-none z-10" />

              <div
                className={`h-full transition-all duration-500 ease-in-out ${color}`}
                style={{ width: `${roundedPercentage}%` }}
              />
            </div>

            <div className="flex flex-row flex-wrap gap-1 max-w-full absolute top-full mt-1 left-[2px] z-20">
              {ailment && <StatusAilmentBadge ailment={ailment} />}
              {statChanges &&
                Object.entries(statChanges).map(([stat, stage]) => {
                  if (stage > 0 || stage < 0)
                    return (
                      <StatChangeBadge key={stat} stat={stat} stage={stage} />
                    )
                })}
            </div>
          </div>

          {/* HP text in the extended area */}
          <h1
            className={`absolute top-1/2 -translate-y-1/2 text-white text-sm font-bold z-20 text-shadow-black text-shadow-xs ${
              percentageOnLeft ? "left-2" : "right-2"
            }`}
          >
            {roundedPercentage}%
          </h1>
        </div>
      </div>
    </div>
  )
}

export default HealthBar
