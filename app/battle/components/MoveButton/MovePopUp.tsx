import React from "react"
import { typeColoursHex } from "@/app/pokedex/components/typeColours"
import { GiCheckMark } from "react-icons/gi"
import { BsExclamationDiamondFill } from "react-icons/bs"
import Image from "next/image"
import { BattleMove } from "@/lib/battle"

interface MovePopUpProps {
  move: BattleMove
  moveEffectiveness: number
  targetPokemon: string
}

function formatMultiplier(multiplier: number): string {
  if (multiplier === 0.25) return "¼x"
  if (multiplier === 0.5) return "½x"
  return `${multiplier}x`
}

function getEffectivenessMessage(
  multiplier: number,
  targetPokemon: string,
): string | null {
  if (multiplier === 1) return null

  const targetLabel = targetPokemon?.trim() ? targetPokemon : "target"
  const multiplierText = formatMultiplier(multiplier)

  if (multiplier === 0) {
    return `Doesn't affect ${targetLabel} (${multiplierText})`
  }

  if (multiplier > 1) {
    return `Super effective vs. ${targetLabel} (${multiplierText})`
  }

  if (multiplier > 0 && multiplier < 1) {
    return `Not very effective vs. ${targetLabel} (${multiplierText})`
  }

  return null
}

const MovePopUp = ({
  move,
  moveEffectiveness,
  targetPokemon,
}: MovePopUpProps) => {
  const typeColor =
    typeColoursHex[move.type.toLowerCase() as keyof typeof typeColoursHex] ??
    "#6b7280"

  const moveCategoryImg =
    move.category.toLowerCase() === "physical"
      ? "/battling/physical-icon.png"
      : move.category.toLowerCase() === "special"
        ? "/battling/special-icon.png"
        : "/battling/status-icon.png"

  const effectivenessMessage = getEffectivenessMessage(
    moveEffectiveness,
    targetPokemon,
  )

  return (
    <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-70 -translate-x-1/2 rounded-md border border-white/30 bg-gray-950/95 p-3 opacity-0 shadow-xl backdrop-blur-sm transition-all duration-150 group-hover:-translate-y-1 group-hover:opacity-100">
      <div className="mb-2 border-b border-white/20 pb-2">
        <h3 className="mb-1 text-base font-bold leading-tight text-white wrap-break-word">
          {move.name}
        </h3>

        <div className="flex items-center gap-2">
          <Image
            src={moveCategoryImg}
            alt={`${move.category} move category icon`}
            width={18}
            height={18}
            className="h-[20px] w-auto"
          />
          <h1
            className="rounded px-1.5 text-sm font-semibold uppercase text-white text-shadow-black text-shadow-xs"
            style={{ backgroundColor: typeColor }}
          >
            {move.type}
          </h1>
        </div>
      </div>

      <p className="mb-2 text-sm text-gray-200 leading-tight">
        {move.effect?.trim() ? move.effect : "No additional effect."}
      </p>

      {move.contact === "Yes" && (
        <div className="flex flex-row items-center gap-1 mb-2">
          <GiCheckMark color="white" size={12} />
          <p className="text-xs text-gray-200 leading-tight">
            Contact (triggers Iron Barbs, etc.)
          </p>
        </div>
      )}

      {effectivenessMessage && (
        <div className="mb-2 flex flex-row items-center gap-1.5">
          <BsExclamationDiamondFill color="white" size={15} />
          <p className="text-xs text-gray-200 leading-tight">
            {effectivenessMessage}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-white/20 pt-2 text-sm text-gray-100">
        <p>Power: {move.power ?? "-"}</p>
        <p>Accuracy: {move.accuracy ? `${move.accuracy}%` : "∞"}</p>
      </div>
    </div>
  )
}

export default MovePopUp
