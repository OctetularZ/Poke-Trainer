"use client"

import { PokemonAbility } from "@/types/ability"
import { Pokemon } from "@/types/pokemon"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect } from "react"
import { typeColours } from "@/app/pokedex/components/typeColours"

const fetchSize = 50
const types = Object.keys(typeColours)

export default function PokemonList() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allLoaded, setAllLoaded] = useState(false)
  const [offset, setOffset] = useState(0)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedAbility, setSelectedAbility] = useState<string>("")
  const [abilities, setAbilities] = useState<PokemonAbility[]>([])

  const [showFilters, setShowFilters] = useState(false)

  const fetchAllPokemon = async (reset = false) => {
    setLoading(true)
    try {
      if (reset) setAllLoaded(false)

      const abilityQuery = selectedAbility
        ? `&abilities=${selectedAbility}`
        : ""

      const res = await fetch(
        `/api/pokemon?limit=${fetchSize}&offset=${reset ? 0 : offset}` +
          (selectedTypes.length > 0
            ? `&types=${selectedTypes.join(",")}`
            : "") +
          abilityQuery,
      )

      if (!res.ok) {
        console.error("Could not fetch Pokemon")
        setError("Could not fetch Pokémon")
        return
      }
      const data: Pokemon[] = await res.json()

      if (data.length < fetchSize) setAllLoaded(true)
      setPokemon((prev) => (reset ? data : [...prev, ...data]))
      setOffset((prev) => (reset ? fetchSize : prev + fetchSize))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllPokemon(true)
  }, [selectedTypes, selectedAbility])

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
    setAllLoaded(false)
  }

  return (
    <div className="flex flex-col justify-center items-center">
      {loading && (
        <motion.div
          className="mt-5"
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.3,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <Image
            src={"/pixel-great-ball.png"}
            width={50}
            height={50}
            alt="pixel-great-ball-loading"
          ></Image>
        </motion.div>
      )}

      <div>
        {pokemon?.map((poke) => (
          <h1 className="text-white">{poke.name}</h1>
        ))}
      </div>
    </div>
  )
}
