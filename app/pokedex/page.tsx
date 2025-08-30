"use client"
import React, { useEffect, useState } from "react"
import { PokemonBasic } from "../api/pokemon/route"
import PokeGrid from "./PokeGrid"

const Pokedex = () => {
  const [pokemon, setPokemon] = useState<PokemonBasic[]>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/pokemon") // your API route path
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
    <div className="flex justify-center gap-5 p-5">
      <h1 className="text-white text-6xl mt-10">Pokedex</h1>
      <PokeGrid />
    </div>
  )
}

export default Pokedex
