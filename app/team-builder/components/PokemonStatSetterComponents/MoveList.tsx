import { GameMove } from "@/types/moves"
import React, { useState } from "react"
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react"
import { FaChevronCircleDown } from "react-icons/fa"

// Fix fetch to get moves as well as they haven't been added to select query

interface MoveListProps {
  moves: GameMove[]
}

export default function MoveList({ moves }: MoveListProps) {
  const [selectedMoves, setSelectedMoves] = useState<GameMove[]>([])
  const [selectedMove, setSelectedMove] = useState<GameMove | null>(null)

  // Remove duplicate moves (due to game duplicates) and remove selected moves
  const availableMoves = moves
    .filter(
      (move, index, self) =>
        index === self.findIndex((m) => m.move?.name === move.move?.name),
    )
    .filter(
      (move) => !selectedMoves.some((sm) => sm.move?.name === move.move?.name),
    )

  const handleMoveSelect = (move: GameMove) => {
    if (selectedMoves.length < 4 && move) {
      setSelectedMoves([...selectedMoves, move])
      setSelectedMove(null) // Reset selection
    }
  }

  const handleRemoveMove = (index: number) => {
    setSelectedMoves(selectedMoves.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full">
      {/* Display Selected Moves */}
      <div className="mb-4">
        <h4 className="text-white text-2xl mb-2">
          Selected Moves ({selectedMoves.length}/4)
        </h4>
        <div className="flex flex-col gap-2">
          {selectedMoves.map((move, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-700 px-4 py-2 rounded-md text-white"
            >
              <h1 className="capitalize text-xl">{move.move?.name}</h1>
              <button
                onClick={() => handleRemoveMove(index)}
                className="text-red-500 hover:text-red-400 text-2xl font-bold"
              >
                <h1>x</h1>
              </button>
            </div>
          ))}
          {selectedMoves.length === 0 && (
            <h1 className="text-gray-400 italic">No moves selected</h1>
          )}
        </div>
      </div>

      {/* Available Move Options Listbox */}
      <Listbox
        value={selectedMove}
        onChange={handleMoveSelect}
        disabled={selectedMoves.length >= 4}
      >
        <div className="relative w-full text-white text-lg">
          <ListboxButton
            className={`flex flex-row justify-between items-center w-full px-2 py-1 rounded border border-gray-300 bg-charmander-dull-200 cursor-pointer focus:outline-none ${
              selectedMoves.length >= 4 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {selectedMove ? selectedMove.move?.name : "Select a move"}
            <FaChevronCircleDown />
          </ListboxButton>

          <ListboxOptions className="absolute z-10 mt-1 w-full bg-charmander-dull-200 border border-gray-300 rounded shadow-lg max-h-60 overflow-auto focus:outline-none">
            {availableMoves.map((move) => (
              <ListboxOption
                key={move.move?.name}
                value={move}
                className={({ active, selected }) =>
                  `cursor-pointer select-none font-pixel px-4 py-2 capitalize ${
                    active ? "bg-charmander-blue-400" : ""
                  } ${selected ? "font-bold bg-charmander-blue-500" : ""}`
                }
              >
                {move.move?.name}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  )
}
