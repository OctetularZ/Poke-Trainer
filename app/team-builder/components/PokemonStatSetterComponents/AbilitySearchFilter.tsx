"use client"
import { PokemonAbility } from "@/types/ability"
import React, { useState } from "react"

interface AbilitySearchFilterProps {
  allAbilities: PokemonAbility[]
  onSelect: (ability: PokemonAbility | null) => void
  value?: string
}

const AbilitySearchFilter = ({
  allAbilities,
  onSelect,
  value = "",
}: AbilitySearchFilterProps) => {
  const [searchTerm, setSearchTerm] = useState(value)
  const [inputFocused, setInputFocused] = useState(false)

  const filteredAbilities = allAbilities.filter((ability) =>
    ability.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelect = (ability: PokemonAbility) => {
    setSearchTerm(ability.name)
    onSelect(ability)
  }

  return (
    <div className="flex flex-col relative w-30 mb-5 text-sm">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          if (e.target.value === "") onSelect(null)
        }}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setTimeout(() => setInputFocused(false), 200)}
        placeholder="Search Ability..."
        className="px-2 py-1 w-full rounded border bg-gray-800 border-gray-600 text-white focus:outline-none focus:border-blue-500"
      />
      {searchTerm && inputFocused && (
        <ul className="text-white absolute left-0 top-full border border-gray-600 max-h-60 overflow-auto w-full bg-gray-800 rounded shadow z-10">
          {filteredAbilities.map((ability) => (
            <li
              key={ability.name}
              onClick={() => handleSelect(ability)}
              className="pl-2 py-1 capitalize cursor-pointer hover:bg-gray-700"
            >
              {ability.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AbilitySearchFilter
