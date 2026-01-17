import { GameMove } from "@/types/moves"
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react"
import React, { useState, useMemo, useEffect } from "react"
import { FaChevronCircleDown } from "react-icons/fa"
import { typeColours, typeColoursHex } from "../../components/typeColours"

interface PokemonMoves {
  loading: boolean
  pokemonMoves: GameMove[]
}

const Moves = ({ loading, pokemonMoves }: PokemonMoves) => {
  const [selectedGame, setSelectedGame] = useState("")
  const [selectedMoveFilter, setSelectedMoveFilter] = useState("level-up")

  const moveLearnMethods = ["level-up", "machine", "evolution", "egg"]

  const learnMethodsMap = {
    "Moves learnt by level up": "level-up",
    "Moves learnt by TM": "machine",
    "Egg moves": "egg",
    "Moves learnt on evolution": "evolution",
  }

  // Extract unique games from pokemonMoves
  const availableGames = useMemo(() => {
    if (!pokemonMoves || pokemonMoves.length === 0) return []
    const games = pokemonMoves
      .map((move) => move.game?.name)
      .filter((game): game is string => game !== undefined && game !== null)
    return Array.from(new Set(games))
  }, [pokemonMoves])

  // Set the first game as default
  useEffect(() => {
    if (availableGames.length > 0 && !selectedGame) {
      setSelectedGame(availableGames[0])
    }
  }, [availableGames, selectedGame])

  return (
    !loading && (
      <div className="flex flex-col gap-10 justify-center items-center w-200">
        <h2 className="text-white text-center text-2xl border-b-2">Moves</h2>
        {/* Game Filter Dropdown */}
        <Listbox value={selectedGame} onChange={setSelectedGame}>
          <div className="relative w-full text-white text-lg">
            <ListboxButton className="flex flex-row justify-between items-center w-full px-2 py-1 rounded border border-gray-300 bg-charmander-dull-200 cursor-pointer focus:outline-none">
              {selectedGame}
              <FaChevronCircleDown />
            </ListboxButton>

            <ListboxOptions className="absolute z-10 mt-1 w-full bg-charmander-dull-200 border border-gray-300 rounded shadow-lg max-h-60 overflow-auto focus:outline-none">
              {availableGames.map((game) => (
                <ListboxOption
                  key={game}
                  value={game}
                  className={({ active, selected }) =>
                    `cursor-pointer select-none font-pixel px-4 py-2 ${
                      active ? "bg-charmander-blue-400" : ""
                    } ${selected ? "font-bold bg-charmander-blue-500" : ""}`
                  }
                >
                  {game}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>

        {/* Move Method Filter Dropdown */}
        <Listbox value={selectedMoveFilter} onChange={setSelectedMoveFilter}>
          <div className="relative w-full text-white text-lg">
            <ListboxButton className="flex flex-row justify-between items-center w-full px-2 py-1 rounded border border-gray-300 bg-charmander-dull-200 cursor-pointer focus:outline-none">
              {selectedMoveFilter.charAt(0).toUpperCase() +
                selectedMoveFilter.slice(1).replace("-", " ")}
              <FaChevronCircleDown />
            </ListboxButton>

            <ListboxOptions className="absolute z-10 mt-1 w-full bg-charmander-dull-200 border border-gray-300 rounded shadow-lg max-h-60 overflow-auto focus:outline-none">
              {moveLearnMethods.map((move) => (
                <ListboxOption
                  key={move}
                  value={move}
                  className={({ active, selected }) =>
                    `cursor-pointer select-none font-pixel px-4 py-2 ${
                      active ? "bg-charmander-blue-400" : ""
                    } ${selected ? "font-bold bg-charmander-blue-500" : ""}`
                  }
                >
                  {move.charAt(0).toUpperCase() +
                    move.slice(1).replace("-", " ")}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>

        <table className="w-full text-white text-center text-2xl">
          <thead>
            <tr className="divide-x">
              {selectedMoveFilter === "level-up" && (
                <th className="bg-charmander-dull-200 border-t-1 border-b-1 py-2">
                  Level
                </th>
              )}
              {selectedMoveFilter === "machine" && (
                <th className="bg-charmander-dull-200 border-t-1 border-b-1 py-2">
                  Machine
                </th>
              )}
              <th className="bg-charmander-dull-200 border-t-1 border-b-1 py-2">
                Move
              </th>
              <th className="bg-charmander-dull-200 border-t-1 border-b-1 py-2">
                Type
              </th>
              <th className="bg-charmander-dull-200 border-t-1 border-b-1 py-2">
                Category
              </th>
              <th className="bg-charmander-dull-200 border-t-1 border-b-1 py-2">
                Power
              </th>
              <th className="bg-charmander-dull-200 border-t-1 border-b-1 py-2">
                Accuracy
              </th>
            </tr>
          </thead>
          <tbody>
            {pokemonMoves.map(
              (move) =>
                move.move &&
                learnMethodsMap[move.method as keyof typeof learnMethodsMap] ===
                  selectedMoveFilter &&
                move.game?.name === selectedGame && (
                  <tr
                    key={`${move.move.name}-${move.method}-${
                      move.level || move.tmNumber || ""
                    }-${move.game?.name || ""}`}
                    className="border-b-white border-b-1"
                  >
                    {selectedMoveFilter === "level-up" && (
                      <td className="py-5">{move.level}</td>
                    )}
                    {selectedMoveFilter === "machine" && (
                      <td className="py-5">{move.tmNumber}</td>
                    )}
                    <td className="py-5">{move.move.name}</td>
                    <td className="py-5">
                      <h4
                        key={move.move.type}
                        className={`text-white text-2xl ${
                          typeColours[
                            move.move.type as keyof typeof typeColours
                          ]
                        } rounded-lg px-3 shadow-md`}
                        style={{
                          filter: `drop-shadow(0 0 6px ${
                            typeColoursHex[
                              move.move.type as keyof typeof typeColoursHex
                            ]
                          })`,
                        }}
                      >
                        {move.move.type}
                      </h4>
                    </td>
                    <td className="py-5">{move.move.category}</td>
                    <td className="py-5">{move.move.power || "-"}</td>
                    <td className="py-5">{move.move.accuracy || "-"}</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    )
  )
}

export default Moves
