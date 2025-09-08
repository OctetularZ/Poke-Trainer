"use client"
import React, { useEffect, useState } from "react"
import { PokemonInfo } from "@/app/api/pokemon/[name]/route"

interface Props {
  pokemon: string
}

const Test = ({ pokemon }: Props) => {
  const [pokemonInfo, setPokemonInfo] = useState<PokemonInfo>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPokemonInfo = async () => {
    try {
      const res = await fetch(`/api/pokemon/${pokemon}`)
      if (!res.ok) {
        console.error("Could not fetch Pokémon")
        setError("Could not fetch Pokémon")
        setLoading(false)
        return
      }
      const data = await res.json()
      setPokemonInfo(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPokemonInfo()
  }, [])

  return (
    <div>
      {!loading && <h1 className="text-white">Pokemon: {pokemonInfo?.id}</h1>}
    </div>
  )
}

export default Test
