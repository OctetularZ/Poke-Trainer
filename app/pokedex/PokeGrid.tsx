import React, { useEffect, useState } from "react"
import PokeCard from "./PokeCard"
import { PokemonBasic } from "../api/all_pokemon/route"

const PokeGrid = () => {
  const [pokemon, setPokemon] = useState<PokemonBasic[]>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/all_pokemon") // your API route path
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch Pokémon")
        return res.json()
      })
      .then((data) => {
        console.log(data)
        setPokemon(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="flex flex-row flex-wrap gap-25 justify-center pb-10">
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
  )
}

export default PokeGrid
