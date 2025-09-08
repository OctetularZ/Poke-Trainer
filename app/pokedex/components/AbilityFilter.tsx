"use client"
import { useState } from "react"
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react"
import { FaChevronCircleDown } from "react-icons/fa"

interface Ability {
  name: string
  url: string
}

interface AbilityFilterProps {
  abilities: Ability[]
  selectedAbility: string
  setSelectedAbility: (ability: string) => void
}

const AbilityFilter = ({
  abilities,
  selectedAbility,
  setSelectedAbility,
}: AbilityFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAbilities = abilities.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col items-center my-4 w-60 text-white">
      <h1 className="text-white text-xl mb-2">Ability:</h1>
      <Listbox value={selectedAbility} onChange={setSelectedAbility}>
        <div className="relative w-full">
          <ListboxButton className="flex flex-row justify-between items-center w-60 px-2 py-1 rounded border border-gray-300 bg-charmander-dull-200 cursor-pointer focus:outline-none">
            {selectedAbility
              ? (() => {
                  const ability = abilities.find(
                    (a) => a.name === selectedAbility
                  )
                  return ability
                    ? ability.name.charAt(0).toUpperCase() +
                        ability.name.slice(1).replace("-", " ")
                    : selectedAbility
                })()
              : "All"}
            <FaChevronCircleDown />
          </ListboxButton>

          <ListboxOptions className="absolute z-10 mt-1 w-full bg-charmander-dull-200 border border-gray-300 rounded shadow-lg max-h-60 overflow-auto focus:outline-none">
            <div className="sticky top-0 bg-charmander-dull-200">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ability..."
                className="w-full px-2 py-1 rounded bg-charmander-dull-200 text-white focus:outline-none"
              />
            </div>

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

            {filteredAbilities.map((ability) => (
              <ListboxOption
                key={ability.name}
                value={ability.name}
                className={({ active, selected }) =>
                  `cursor-pointer select-none font-pixel px-4 py-2 ${
                    active ? "bg-charmander-blue-400" : ""
                  } ${selected ? "font-bold bg-charmander-blue-500" : ""}`
                }
              >
                {ability.name.charAt(0).toUpperCase() +
                  ability.name.slice(1).replace("-", " ")}
              </ListboxOption>
            ))}

            {filteredAbilities.length === 0 && (
              <div className="px-4 py-2 text-gray-400">No matches</div>
            )}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  )
}

export default AbilityFilter
