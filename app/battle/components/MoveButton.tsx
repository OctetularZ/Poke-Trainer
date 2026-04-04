import React from "react"
import { typeColoursHex } from "@/app/pokedex/components/typeColours"

interface MoveButtonProps {
  disabled: boolean
  onClick: () => void
  moveName: string
  moveType: string
  movePPLeft: number | null
  movePPMax: number | null
}

const MoveButton = ({
  disabled,
  moveName,
  moveType,
  movePPLeft,
  movePPMax,
  onClick,
}: MoveButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex flex-col gap-0.5 px-2 py-1 rounded-md border-1 border-amber-50 hover:scale-105 transition-all`}
      style={{
        backgroundColor:
          typeColoursHex[moveType.toLowerCase() as keyof typeof typeColoursHex],
        filter: `drop-shadow(0 0 5px ${
          typeColoursHex[moveType.toLowerCase() as keyof typeof typeColoursHex]
        })`,
      }}
    >
      <h1 className="text-white text-center text-lg leading-none">
        {moveName}
      </h1>
      <span className="flex flex-row justify-between text-gray-100 text-lg leading-none">
        <h4>{moveType}</h4>
        {movePPMax != null && (
          <h4>
            {movePPLeft}/{movePPMax}
          </h4>
        )}
      </span>
    </button>
  )
}

export default MoveButton
