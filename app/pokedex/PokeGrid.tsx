"use client"
import React, { useEffect, useState } from "react"
import PokeCard from "./PokeCard"
import { PokemonBasic } from "../api/pokemon/route"
import Image from "next/image"
import { motion } from "motion/react"
import Filter from "./Filter"
import { typeColours } from "./typeColours"
import TypeFilter from "./Filter"

const fetchSize = 12
const types = Object.keys(typeColours)

const PokeGrid = () => {
  const [pokemon, setPokemon] = useState<PokemonBasic[]>([])
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [allLoaded, setAllLoaded] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const fetchPokemon = async (reset = false) => {
    setLoading(true)
    try {
      if (reset) setAllLoaded(false)

      const res = await fetch(
        `/api/pokemon?limit=${fetchSize}&offset=${reset ? 0 : offset}` +
          (selectedTypes.length > 0 ? `&types=${selectedTypes.join(",")}` : "")
      )
      const data: PokemonBasic[] = await res.json()

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
    fetchPokemon(true)
  }, [selectedTypes])

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
    setAllLoaded(false)
  }

  return (
    <div className="flex flex-col items-center">
      <TypeFilter
        types={types}
        selectedTypes={selectedTypes}
        toggleType={toggleType}
        typeColours={typeColours}
      />

      <div className="flex flex-row flex-wrap gap-10 pt-10 justify-center pb-10">
        {pokemon?.map((poke) => (
          <PokeCard
            key={poke.id}
            id={poke.id}
            name={`${poke.name.charAt(0).toUpperCase()}${poke.name.slice(1)}`}
            sprite={
              poke.showdown.front_default ||
              poke.showdown.front_default ||
              poke.sprites.front_default ||
              "/placeholder.png"
            }
            types={poke.types}
          />
        ))}
      </div>
      {loading ? (
        <motion.div
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
      ) : (
        !allLoaded && (
          <button
            onClick={() => fetchPokemon()}
            className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md cursor-pointer hover:bg-red-600"
          >
            Load More
          </button>
        )
      )}
    </div>
  )
}

export default PokeGrid
