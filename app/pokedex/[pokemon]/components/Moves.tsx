import { Move } from "@/types/moves"
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react"
import React, { useState } from "react"
import { FaChevronCircleDown } from "react-icons/fa"
import { typeColours, typeColoursHex } from "../../components/typeColours"

interface PokemonMoves {
  loading: boolean
  pokemonMoves: Move[]
}

const Moves = ({ loading, pokemonMoves }: PokemonMoves) => {
  const [selectedMoveFilter, setSelectedMoveFilter] = useState("")

  const moveLearnMethods = ["level-up", "machine", "tutor", "egg"]

  return (
    <div className="flex flex-col gap-10 justify-center items-center w-200">
      <Listbox value={selectedMoveFilter} onChange={setSelectedMoveFilter}>
        <div className="relative w-full text-white text-lg">
          <ListboxButton className="flex flex-row justify-between items-center w-full px-2 py-1 rounded border border-gray-300 bg-charmander-dull-200 cursor-pointer focus:outline-none">
            {selectedMoveFilter.charAt(0).toUpperCase() +
              selectedMoveFilter.slice(1).replace("-", " ") || "All"}
            <FaChevronCircleDown />
          </ListboxButton>

          <ListboxOptions className="absolute z-10 mt-1 w-full bg-charmander-dull-200 border border-gray-300 rounded shadow-lg max-h-60 overflow-auto focus:outline-none">
            <ListboxOption
              key=""
              value=""
              className={({ active, selected }) =>
                `cursor-pointer select-none font-pixel px-4 py-2 ${
                  active ? "bg-charmander-blue-400" : ""
                } ${selected ? "font-bold bg-charmander-blue-500" : ""}`
              }
            >
              All
            </ListboxOption>

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
                {move.charAt(0).toUpperCase() + move.slice(1).replace("-", " ")}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
      {!loading && (
        <table className="w-full text-white text-center text-2xl">
          <thead>
            <tr className="divide-x">
              <th className="bg-charmander-dull-200 border-t-1 border-b-1 py-2">
                {selectedMoveFilter}
              </th>
              <th className="bg-charmander-dull-200 border-t-1 border-b-1">
                Move
              </th>
              <th className="bg-charmander-dull-200 border-t-1 border-b-1">
                Type
              </th>
              <th className="bg-charmander-dull-200 border-t-1 border-b-1">
                Category
              </th>
              <th className="bg-charmander-dull-200 border-t-1 border-b-1">
                Power
              </th>
              <th className="bg-charmander-dull-200 border-t-1 border-b-1">
                Accuracy
              </th>
            </tr>
          </thead>
          <tbody>
            {pokemonMoves.map((move) => (
              <tr key={move.id} className="border-b-white border-b-1">
                <td className="py-5">
                  {move.move_learn_method.at(-1)?.move_learn_method.name ===
                  "level-up"
                    ? move.move_learn_method.at(-1)?.level_learned_at
                    : "M"}
                </td>
                <td>
                  {move.name.charAt(0).toUpperCase() +
                    move.name.slice(1).replace("-", " ")}
                </td>
                <td>
                  <h4
                    key={move.type.name}
                    className={`text-white text-2xl ${
                      typeColours[move.type.name as keyof typeof typeColours]
                    } rounded-lg px-3 shadow-md`}
                    style={{
                      filter: `drop-shadow(0 0 6px ${
                        typeColoursHex[
                          move.type.name as keyof typeof typeColoursHex
                        ]
                      })`,
                    }}
                  >
                    {`${move.type.name
                      .charAt(0)
                      .toUpperCase()}${move.type.name.slice(1)}`}
                  </h4>
                </td>
                <td>{move.damage_class.name}</td>
                <td>{move.power || "-"}</td>
                <td>{move.accuracy || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Moves
