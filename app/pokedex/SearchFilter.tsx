"use client"
import React, { useState } from "react"
import Link from "next/link"

interface SearchFilterProps {
  allPokemonNames: string[]
}

const SearchFilter = ({ allPokemonNames }: SearchFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [inputFocused, setInputFocused] = useState(false)

  const filteredNames = allPokemonNames.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col relative w-60 mb-5">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        placeholder="Search Pokémon..."
        className="px-2 py-1 w-60 rounded border bg-charmander-dull-200 border-gray-300 text-white focus:outline-none"
      />
      {searchTerm && inputFocused && (
        <ul className="text-white absolute left-0 top-full border border-gray-300 max-h-60 overflow-auto w-60 bg-charmander-dull-200 rounded shadow z-10">
          {filteredNames.map((name) => (
            <Link
              key={name}
              href={`/pokedex/${name.charAt(0).toUpperCase() + name.slice(1)}`}
            >
              <li className="pl-2 py-1 hover:bg-charmander-blue-500" key={name}>
                {name.charAt(0).toUpperCase() +
                  name.slice(1).replaceAll("-", " ")}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchFilter
