"use client"
import React, { useEffect, useState } from "react"
import { PokemonInfo } from "@/types/pokemonFull"
import { motion } from "motion/react"
import Image from "next/image"
import { PokemonType } from "@/types/pokemonBasic"
import { typeColours, typeColoursHex } from "../../components/typeColours"
import { HiArrowLongRight } from "react-icons/hi2"
import EvolutionChain from "./EvolutionChain"
import PokemonDisplay from "./PokemonDisplay"

interface Props {
  pokemon: string
}

const Main = ({ pokemon }: Props) => {
  const [pokemonInfo, setPokemonInfo] = useState<PokemonInfo>()
  const [sprites, setSprites] = useState<string[]>()
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
      />
      <EvolutionChain pokemonInfo={pokemonInfo!} />
    </div>
  )
}

export default Main
