import React from "react"
import { typeColoursHex } from "@/app/pokedex/components/typeColours"

interface MovePopUpProps {
  moveName: string
  moveType: string
  moveEffect: string
  movePower: number | null
  moveAccuracy: number | null
}

const MovePopUp = ({
  moveName,
  moveType,
  moveEffect,
  movePower,
  moveAccuracy,
}: MovePopUpProps) => {
  const typeColor =
    typeColoursHex[moveType.toLowerCase() as keyof typeof typeColoursHex] ??
    "#6b7280"

  return (
    <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2 rounded-md border border-white/30 bg-gray-950/95 p-3 opacity-0 shadow-xl backdrop-blur-sm transition-all duration-150 group-hover:-translate-y-1 group-hover:opacity-100">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-base font-bold text-white leading-tight">
          {moveName}
        </h3>
        <h4
          className="rounded px-2 py-0.5 text-lg font-semibold uppercase text-black"
          style={{ backgroundColor: typeColor }}
        >
          {moveType}
        </h4>
      </div>

      <p className="mb-2 text-sm text-gray-200 leading-tight border-t border-white/20 pt-2">
        {moveEffect?.trim() ? moveEffect : "No additional effect."}
      </p>

      <div className="flex items-center justify-between border-t border-white/20 pt-2 text-sm text-gray-100">
        <p>Power: {movePower ?? "-"}</p>
        <p>Accuracy: {moveAccuracy ?? "∞"}</p>
      </div>
    </div>
  )
}

export default MovePopUp
