import React from "react"
import { typeColoursHex } from "@/app/pokedex/components/typeColours"
import MovePopUp from "./MovePopUp"

interface MoveButtonProps {
  disabled: boolean
  onClick: () => void
  moveName: string
  moveEffect: string
  movePower: number | null
  moveAccuracy: number | null
  moveType: string
  movePPLeft: number | null
  movePPMax: number | null
}

const MoveButton = ({
  disabled,
  moveName,
  moveEffect,
  movePower,
  moveAccuracy,
  moveType,
  movePPLeft,
  movePPMax,
  onClick,
}: MoveButtonProps) => {
  return (
    <div className="group relative">
      <MovePopUp
        moveName={moveName}
        moveType={moveType}
        moveEffect={moveEffect}
        movePower={movePower}
        moveAccuracy={moveAccuracy}
      />

      <button
        disabled={disabled}
        onClick={onClick}
        className={`flex w-full flex-col gap-0.5 rounded-md border-1 border-amber-50 px-2 py-1 transition-all hover:scale-105`}
        style={{
          backgroundColor:
            typeColoursHex[
              moveType.toLowerCase() as keyof typeof typeColoursHex
            ],
          filter: `drop-shadow(0 0 5px ${
            typeColoursHex[
              moveType.toLowerCase() as keyof typeof typeColoursHex
            ]
          })`,
        }}
      >
        <h1 className="text-center text-lg leading-none text-white">
          {moveName}
        </h1>
        <span className="flex flex-row justify-between text-lg leading-none text-gray-100">
          <h4>{moveType}</h4>
          {movePPMax != null && (
            <h4>
              {movePPLeft}/{movePPMax}
            </h4>
          )}
        </span>
      </button>
    </div>
  )
}

export default MoveButton
