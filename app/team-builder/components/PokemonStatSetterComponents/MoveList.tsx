import { GameMove } from "@/types/moves"
import React, { useState } from "react"
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react"
import { FaChevronCircleDown } from "react-icons/fa"
import { typeColoursHex } from "@/app/pokedex/components/typeColours"

interface MoveListProps {
  moves: GameMove[]
  onMovesChange: (moves: GameMove[]) => void
  initialMoves?: GameMove[]
}

export default function MoveList({
  moves,
  onMovesChange,
  initialMoves,
}: MoveListProps) {
  const [selectedMoves, setSelectedMoves] = useState<GameMove[]>(
    initialMoves ?? [],
  )
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

  // Handles when a move is selected.
  // Added to selected move array
  const handleMoveSelect = (move: GameMove) => {
    if (selectedMoves.length < 4 && move) {
      const updated = [...selectedMoves, move]
      setSelectedMoves(updated)
      onMovesChange(updated)
      setSelectedMove(null)
    }
  }

  const handleRemoveMove = (index: number) => {
    const updated = selectedMoves.filter((_, i) => i !== index)
    setSelectedMoves(updated)
    onMovesChange(updated)
  }

  return (
    <div className="w-full">
      {/* Display Selected Moves */}
      <div className="mb-4">
        <h4 className="text-white text-2xl mb-2">
          Selected Moves ({selectedMoves.length}/4)
        </h4>
        {selectedMoves.length > 0 && (
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_32px] items-center bg-gray-700 px-4 py-2 rounded-md text-white text-lg text-center mb-2">
            <h1>Name</h1>
            <h1>Type</h1>
            <h1>Category</h1>
            <h1>Power</h1>
            <h1>Accuracy</h1>
            <span />
          </div>
        )}
        <div className="flex flex-col gap-2">
          {selectedMoves.map((move, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_32px] items-center bg-gray-700 px-4 py-2 rounded-md text-white text-center capitalize"
            >
              <h1 className="text-lg">{move.move?.name}</h1>
              <h1
                className="px-2 py-1 rounded text-lg justify-self-center"
                style={{
                  backgroundColor:
                    typeColoursHex[
                      move.move?.type.toLowerCase() as keyof typeof typeColoursHex
                    ],
                }}
              >
                {move.move?.type}
              </h1>
              <h1 className="text-lg">{move.move?.category}</h1>
              <h1 className="text-lg">{move.move?.power ?? "—"}</h1>
              <h1 className="text-lg">{move.move?.accuracy ?? "—"}</h1>
              <button
                onClick={() => handleRemoveMove(index)}
                className="text-red-500 hover:text-red-400 text-2xl font-bold"
              >
                <h1>×</h1>
              </button>
            </div>
          ))}
          {selectedMoves.length === 0 && (
            <h1 className="text-gray-400 text-lg italic">No moves selected</h1>
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
            {/* Header Row */}
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] px-4 py-2 text-gray-400 text-lg border-b border-gray-400 sticky top-0 bg-charmander-dull-200 text-center mb-2">
              <h1>Name</h1>
              <h1>Type</h1>
              <h1>Category</h1>
              <h1>Power</h1>
              <h1>Accuracy</h1>
            </div>
            {availableMoves.map((move) => (
              <ListboxOption
                key={move.move?.name}
                value={move}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 capitalize ${
                    active ? "bg-charmander-blue-400" : ""
                  }`
                }
              >
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center text-center text-white text-lg">
                  <h1>{move.move?.name}</h1>
                  <h1
                    className="px-2 py-1 rounded justify-self-center"
                    style={{
                      backgroundColor:
                        typeColoursHex[
                          move.move?.type.toLowerCase() as keyof typeof typeColoursHex
                        ],
                    }}
                  >
                    {move.move?.type}
                  </h1>
                  <h1>{move.move?.category}</h1>
                  <h1>{move.move?.power ?? "—"}</h1>
                  <h1>{move.move?.accuracy ?? "—"}</h1>
                </div>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  )
}
