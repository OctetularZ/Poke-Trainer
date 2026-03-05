"use client"
import { namesAndSlugs } from "@/app/pokedex/components/SearchFilter"
import React, { useState } from "react"

interface PokemonSearchFilterProps {
  allPokemon: namesAndSlugs[]
  onSelect: (pokemon: namesAndSlugs) => void
}

const PokemonSearchFilter = ({
  allPokemon,
  onSelect,
}: PokemonSearchFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [inputFocused, setInputFocused] = useState(false)

  const filteredPokemon = allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelect = (pokemon: namesAndSlugs) => {
    setSearchTerm(pokemon.name)
    onSelect(pokemon)
  }

  return (
    <div className="flex flex-col relative w-30 mb-5 text-sm">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setTimeout(() => setInputFocused(false), 200)}
        placeholder="Search Name..."
        className="px-2 py-1 w-full rounded border bg-gray-800 border-gray-600 text-white focus:outline-none focus:border-blue-500"
      />
      {searchTerm && inputFocused && (
        <ul className="text-white absolute left-0 top-full border border-gray-600 max-h-60 overflow-auto w-full bg-gray-800 rounded shadow z-10">
          {filteredPokemon.map((pokemon) => (
            <li
              key={pokemon.slug}
              onClick={() => handleSelect(pokemon)}
              className="pl-2 py-1 capitalize cursor-pointer hover:bg-gray-700"
            >
              {pokemon.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PokemonSearchFilter
