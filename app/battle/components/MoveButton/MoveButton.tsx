import React from "react"
import { typeColoursHex } from "@/app/pokedex/components/typeColours"
import { BattleMove } from "@/lib/battle"
import MovePopUp from "./MovePopUp"

interface MoveButtonProps {
  disabled: boolean
  onClick: () => void
  move: BattleMove
  moveEffectiveness: number
  targetPokemon: string
}

const MoveButton = ({
  disabled,
  move,
  moveEffectiveness,
  targetPokemon,
  onClick,
}: MoveButtonProps) => {
  return (
    <div className="group relative">
      <MovePopUp
        move={move}
        moveEffectiveness={moveEffectiveness}
        targetPokemon={targetPokemon}
      />

      <button
        disabled={disabled}
        onClick={onClick}
        className={`flex w-full flex-col gap-0.5 rounded-md border-1 border-amber-50 px-2 py-1 transition-all hover:scale-105 text-shadow-black text-shadow-xs`}
        style={{
          backgroundColor:
            typeColoursHex[
              move.type.toLowerCase() as keyof typeof typeColoursHex
            ],
          filter: `drop-shadow(0 0 5px ${
            typeColoursHex[
              move.type.toLowerCase() as keyof typeof typeColoursHex
            ]
          })`,
        }}
      >
        <h1 className="text-center text-lg leading-none text-white">
          {move.name}
        </h1>
        <span className="flex flex-row justify-between text-lg leading-none text-gray-100">
          <h4>{move.type}</h4>
          {move.maxPP != null && (
            <h4>
              {move.remainingPP}/{move.maxPP}
            </h4>
          )}
        </span>
      </button>
    </div>
  )
}

export default MoveButton
