"use client"
import React, { useEffect, useState } from "react"
import PokeCard from "./PokeCard"
import { Pokemon } from "@/types/pokemon"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { typeColours } from "./typeColours"
import TypeFilter from "./TypeFilter"
import AbilityFilter from "./AbilityFilter"
import SearchFilter, { namesAndSlugs } from "./SearchFilter"
import { FaChevronCircleDown } from "react-icons/fa"
import { PokemonAbility } from "@/types/ability"

const fetchSize = 12
const types = Object.keys(typeColours)

const PokeGrid = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [allLoaded, setAllLoaded] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedAbility, setSelectedAbility] = useState<string>("")
  const [abilities, setAbilities] = useState<PokemonAbility[]>([])
  const [pokemonNames, setPokemonNames] = useState<namesAndSlugs[]>([])

  const [showFilters, setShowFilters] = useState(false)

  const fetchPokemon = async (reset = false) => {
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
          abilityQuery
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

  const fetchNames = async () => {
    try {
      const res = await fetch("/api/names")
      if (!res.ok) {
        setError("Failed to fetch pokemon names! Please refresh")
        return
      }
      const names = await res.json()
      return names
    } catch (error) {
      console.error("Error fetching names:", error)
      setError("Failed to fetch pokemon names! Please refresh")
      return
    }
  }

  const fetchAbilities = async () => {
    try {
      const res = await fetch("/api/abilities")
      if (!res.ok) {
        setError("Failed to fetch pokemon abilities! Please refresh")
        return
      }
      const abilities = await res.json()
      return abilities
    } catch (error) {
      console.error("Error fetching abilities:", error)
      setError("Failed to fetch pokemon abilities! Please refresh")
      return
    }
  }

  useEffect(() => {
    const loadNames = async () => {
      const pokemonNames = await fetchNames()
      if (pokemonNames) {
        setPokemonNames(pokemonNames)
      }
    }
    loadNames()
  }, [])

  useEffect(() => {
    fetchPokemon(true)
  }, [selectedTypes, selectedAbility])

  useEffect(() => {
    const loadAbilities = async () => {
      const abilitiesData = await fetchAbilities()
      if (abilitiesData) {
        setAbilities(abilitiesData)
      }
    }
    loadAbilities()
  }, [])

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
    setAllLoaded(false)
  }

  return (
    <div className="flex flex-col items-center w-full">
      <SearchFilter allPokemon={pokemonNames} />

      <button
        className="flex flex-row justify-center items-center gap-2 py-1 w-10/12 text-white cursor-pointer rounded-md bg-charmander-dull-200"
        onClick={() => setShowFilters((prev) => !prev)}
      >
        <h1>Filter</h1>
        <motion.div
          animate={{ rotate: showFilters ? -180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronCircleDown />
        </motion.div>
      </button>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="flex flex-col justify-center items-center py-3 rounded-md bg-charmander-blue-900 w-10/12"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AbilityFilter
              abilities={abilities}
              selectedAbility={selectedAbility}
              setSelectedAbility={setSelectedAbility}
            />
            <TypeFilter
              types={types}
              selectedTypes={selectedTypes}
              toggleType={toggleType}
              typeColours={typeColours}
            />
          </motion.div>
        )}
      </AnimatePresence>

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

      <div className="flex flex-row flex-wrap gap-10 pt-10 justify-center pb-10">
        {pokemon?.map((poke) => (
          <PokeCard
            key={poke.id}
            slug={poke.slug}
            nationalNumber={poke.nationalNumber}
            id={poke.id}
            name={poke.name}
            sprite={
              poke.sprites.other.showdown.front_default ||
              poke.sprites.front_default ||
              "/placeholder.png"
            }
            types={poke.types}
          />
        ))}
      </div>
      {loading ? (
        <motion.div
          className="mb-10"
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
            className="px-6 py-3 mb-10 bg-charmander-blue-500 text-white font-semibold rounded-lg shadow-md drop-shadow-[0_0_10px_rgba(41,150,246,0.7)] cursor-pointer hover:bg-charmander-blue-300 transition-colors "
          >
            Load More
          </button>
        )
      )}
    </div>
  )
}

export default PokeGrid
