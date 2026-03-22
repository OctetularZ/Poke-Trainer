import React from "react"
import {
  typeColours,
  typeColoursHex,
} from "@/app/pokedex/components/typeColours"

interface MoveButtonProps {
  disabled: boolean
  onClick: () => void
  moveName: string
  moveType: string
  movePPLeft: number
  movePPMax: number
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
      className={`flex flex-col gap-0.5 ${typeColours[moveType.toLowerCase() as keyof typeof typeColours]} w-40 px-2 py-1 rounded-md border-1 border-amber-50 hover:scale-105 transition-all`}
      style={{
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
        <h4>
          {movePPLeft}/{movePPMax}
        </h4>
      </span>
    </button>
  )
}

export default MoveButton
