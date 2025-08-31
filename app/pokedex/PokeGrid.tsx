import React, { useEffect, useState } from "react"
import PokeCard from "./PokeCard"
import { PokemonBasic } from "../api/all_pokemon/route"

const PokeGrid = () => {
  const [displayedPokemon, setDisplayedPokemon] = useState<PokemonBasic[]>([])
  const [allPokemon, setAllPokemon] = useState<PokemonBasic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(12)

  useEffect(() => {
    fetch("/api/all_pokemon?limit=12") // Show 12 pokemon initially
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch Pokémon")
        return res.json()
      })
      .then((data) => {
        console.log(data)
        setDisplayedPokemon(data)
        setLoading(false)

        // Fetch more pokemon in background
        fetch("/api/all_pokemon?limit=100")
          .then((res) => res.json())
          .then((fullData) => setAllPokemon(fullData))
          .catch((err) => console.error("Background fetch failed:", err))
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const handleLoadMore = () => {
    const newCount = visibleCount + 12
    setVisibleCount(newCount)
    if (allPokemon.length > 0) {
      setDisplayedPokemon(allPokemon.slice(0, newCount))
    }
  }

  return (
    <>
      <div className="flex flex-row flex-wrap gap-10 justify-center pb-10">
        {displayedPokemon?.slice(0, visibleCount).map((poke) => (
          <PokeCard
            key={poke.id}
            id={poke.id}
            name={`${poke.name.charAt(0).toUpperCase()}${poke.name.slice(1)}`}
            sprite={poke.showdown.front_default}
            types={poke.types}
          />
        ))}
      </div>
      {/* Load more button */}
      {visibleCount < allPokemon.length && (
        <button
          onClick={handleLoadMore}
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md cursor-pointer hover:bg-red-600"
        >
          Load More
        </button>
      )}
    </>
  )
}

export default PokeGrid
