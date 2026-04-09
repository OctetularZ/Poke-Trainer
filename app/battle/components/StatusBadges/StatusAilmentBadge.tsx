import React from "react"

interface StatusAilmentBadgeProps {
  ailment: BattleStatus
}

export const ailmentColourMapper: Record<BattleStatus, string> = {
  burn: "#ff4423",
  poison: "#aa5599",
  badly_poison: "#2596be",
  paralysis: "#ffcc33",
  sleep: "#aaaa99",
  freeze: "#66ccfd",
}

export const ailmentCodeMapper: Record<BattleStatus, string> = {
  burn: "BRN",
  poison: "PSN",
  badly_poison: "PSN",
  paralysis: "PAR",
  sleep: "SLP",
  freeze: "FRZ",
}

export type BattleStatus =
  | "burn"
  | "poison"
  | "badly_poison"
  | "paralysis"
  | "sleep"
  | "freeze"

const StatusAilmentBadge = ({ ailment }: StatusAilmentBadgeProps) => {
  return (
    <div
      className="items-center rounded-sm px-2 shadow-xs/50 shadow-black"
      style={{
        backgroundColor: ailmentColourMapper[ailment],
      }}
    >
      <h1 className="text-center text-white leading-none text-shadow-black text-shadow-xs">
        {ailmentCodeMapper[ailment]}
      </h1>
    </div>
  )
}

export default StatusAilmentBadge
