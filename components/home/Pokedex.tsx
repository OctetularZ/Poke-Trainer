"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { PokemonInfo } from "@/app/api/pokemon/[name]/route"
import PokeCard from "@/app/pokedex/PokeCard"
import PokeCardSkeleton from "../skeletons/PokeCardSkeleton"

const Pokedex = () => {
  const [showcasePokemon, setShowcasePokemon] = useState<PokemonInfo>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPokemon = async () => {
      const res = await fetch("/api/pokemon/Dragapult")

      if (!res.ok) return console.error("Couldn't fetch showcase pokemon!")

      const data: PokemonInfo = await res.json()

      setShowcasePokemon(data)
      setLoading(false)
    }
    fetchPokemon()
  }, [])

  return (
    <section id={"pokdex"} className="flex flex-col items-center">
      <div className="flex flex-row flex-wrap justify-center gap-20 items-center pt-30">
        {loading ? (
          <PokeCardSkeleton />
        ) : (
          <PokeCard
            id={showcasePokemon!.id}
            name={showcasePokemon!.name}
            sprite={
              showcasePokemon?.sprites.other.showdown.front_default ||
              showcasePokemon?.sprites.front_default ||
              "/placeholder.png"
            }
            types={showcasePokemon!.types}
          />
        )}
      </div>
    </section>
  )
}

export default Pokedex
