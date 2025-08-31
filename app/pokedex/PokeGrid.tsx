import React, { useEffect, useState } from "react"
import PokeCard from "./PokeCard"
import { PokemonBasic } from "../api/all_pokemon/route"

const chunkSize = 12

const PokeGrid = () => {
  const [pokemon, setPokemon] = useState<PokemonBasic[]>([])
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [allLoaded, setAllLoaded] = useState(false)

  const fetchPokemon = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/all_pokemon?limit=${chunkSize}&offset=${offset}`
      )
      const data: PokemonBasic[] = await res.json()

      if (data.length < chunkSize) setAllLoaded(true) // no more data
      setPokemon((prev) => [...prev, ...data])
      setOffset((prev) => prev + chunkSize)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPokemon() // fetch first batch on mount
  }, [])

  return (
    <>
      <div className="flex flex-row flex-wrap gap-10 justify-center pb-10">
        {pokemon?.map((poke) => (
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
      {!allLoaded && (
        <button
          onClick={fetchPokemon}
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md cursor-pointer hover:bg-red-600"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </>
  )
}

export default PokeGrid
