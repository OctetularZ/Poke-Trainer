"use client"
import React, { useState } from "react"
import Link from "next/link"

export interface namesAndSlugs {
  name: string
  slug: string
}

interface SearchFilterProps {
  allPokemon: namesAndSlugs[]
}

const SearchFilter = ({ allPokemon }: SearchFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [inputFocused, setInputFocused] = useState(false)

  const filteredPokemon = allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col relative w-60 mb-5">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setTimeout(() => setInputFocused(false), 200)}
        placeholder="Search Pokémon..."
        className="px-2 py-1 w-60 rounded border bg-charmander-dull-200 border-gray-300 text-white focus:outline-none"
      />
      {searchTerm && inputFocused && (
        <ul className="text-white absolute left-0 top-full border border-gray-300 max-h-60 overflow-auto w-60 bg-charmander-dull-200 rounded shadow z-10">
          {filteredPokemon.map((pokemon) => (
            <Link key={pokemon.name} href={`/pokedex/${pokemon.slug}`}>
              <li
                className="pl-2 py-1 hover:bg-charmander-blue-500"
                key={pokemon.name}
              >
                {pokemon.name}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchFilter
