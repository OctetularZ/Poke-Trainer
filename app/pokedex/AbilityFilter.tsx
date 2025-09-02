"use client"
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
}: AbilityFilterProps) => (
  <div className="flex flex-col items-center my-4 w-60 text-white">
    <h1 className="text-white text-lg mb-2">Ability:</h1>
    <Listbox value={selectedAbility} onChange={setSelectedAbility}>
      <div className="relative">
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
          <ListboxOption
            key=""
            value=""
            className={({ active, selected }) =>
              `cursor-pointer select-none px-4 py-2 ${
                active ? "bg-charmander-blue-400" : ""
              } ${selected ? "font-bold bg-charmander-blue-500" : ""}`
            }
          >
            All
          </ListboxOption>
          {abilities.map((ability) => (
            <ListboxOption
              key={ability.name}
              value={ability.name}
              className={({ active, selected }) =>
                `cursor-pointer select-none px-4 py-2 ${
                  active ? "bg-charmander-blue-400" : ""
                } ${selected ? "font-bold bg-charmander-blue-500" : ""}`
              }
            >
              {ability.name.charAt(0).toUpperCase() +
                ability.name.slice(1).replace("-", " ")}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  </div>
)

export default AbilityFilter
