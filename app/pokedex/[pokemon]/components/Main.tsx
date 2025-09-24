"use client"
import React, { useEffect, useState } from "react"
import { PokemonInfo } from "@/types/pokemonFull"
import EvolutionChain from "./EvolutionChain"
import PokemonDisplay from "./PokemonDisplay"
import PokemonStats from "./PokemonStats"
import TypeChart from "./TypeChart"

interface Props {
  pokemon: string
}

const Main = ({ pokemon }: Props) => {
  const [pokemonInfo, setPokemonInfo] = useState<PokemonInfo>()
  const [sprites, setSprites] = useState<string[]>()
  const [shinySprites, setShinySprites] = useState<string[]>()
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
      setSprites([
        data?.sprites.other.showdown.front_default ||
          data?.sprites.front_default,
        data?.sprites.other.showdown.back_default || data?.sprites.back_default,
      ])
      setShinySprites([
        data?.sprites.other.showdown.front_shiny || data?.sprites.front_shiny,
        data?.sprites.other.showdown.back_shiny || data?.sprites.back_shiny,
      ])
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
    <div className="flex flex-col justify-center items-center my-20">
      <PokemonDisplay
        loading={loading}
        pokemon={pokemon}
        pokemonInfo={pokemonInfo!}
        sprites={sprites!}
        shinySprites={shinySprites!}
      />
      <PokemonStats loading={loading} stats={pokemonInfo?.stats!} />
      <TypeChart loading={loading} typeInfo={pokemonInfo?.types_info!} />
      <EvolutionChain loading={loading} pokemonInfo={pokemonInfo!} />
    </div>
  )
}

export default Main
