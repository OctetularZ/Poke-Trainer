"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { motion, Variants } from "motion/react"
import { Pokemon } from "@/types/pokemon"
import PokeCard from "@/app/pokedex/components/PokeCard"
import PokeCardSkeleton from "../skeletons/PokeCardSkeleton"
import { FaArrowRight } from "react-icons/fa6"
import SearchFilter, {
  namesAndSlugs,
} from "@/app/pokedex/components/SearchFilter"

const Pokedex = () => {
  const [showcasePokemon, setShowcasePokemon] = useState<Pokemon>()
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [error, setError] = useState("")
  const [pokemonNames, setPokemonNames] = useState<namesAndSlugs[]>([])

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
    const fetchPokemon = async () => {
      const res = await fetch("/api/pokemon/dragapult")

      if (!res.ok) {
        console.error("Couldn't fetch showcase pokemon!")
        setError("Couldn't fetch showcase pokemon!")
        return
      }

      const data: Pokemon = await res.json()

      setShowcasePokemon(data)
      setLoading(false)
    }
    fetchPokemon()
  }, [])

  const arrowVariants: Variants = {
    initial: { x: -40 },
    hover: { x: 0 },
  }

  return (
    <section id={"pokedex"} className="flex flex-col items-center">
      <div className="flex flex-row flex-wrap justify-center pb-20 gap-40 items-center pt-20 px-10 max-xl:gap-15">
        <div className="flex flex-col justify-center items-center max-w-150">
          <h1 className="text-white text-center text-5xl pb-5">Pokédex</h1>
          <h2 className="text-white/60 text-xl text-center text-highlight">
            Explore all Pokémon species in one place with the Pokédex. Search by
            name, type, or abilities and instantly pull up the information you
            are looking for. This Pokédex includes{" "}
            <mark>over 900+ Pokémon</mark>, from{" "}
            <span className="text-white">gen 1 to gen 9</span>, and provides
            each Pokémon's moves, abilities, type effectiveness, and more, to
            help you learn faster and build stronger teams. Hunt for your
            favourites, study counters, or discover new additions to your teams.{" "}
            <mark>Your next MVP might be one scroll away.</mark>
          </h2>
          <div className="flex flex-row gap-3 mt-10 justify-center items-center">
            <Link href={"/pokedex"}>
              <motion.button
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                whileHover={{
                  backgroundColor: "#29B6F6",
                  color: "white",
                  transition: { color: { delay: 0.1 } },
                }}
                className="py-2 px-5 rounded-md bg-white cursor-pointer text-lg"
              >
                Visit Pokédex
              </motion.button>
            </Link>
            <motion.div
              className="-z-5 max-sm:hidden"
              variants={arrowVariants}
              initial="initial"
              animate={hovered ? "hover" : "initial"}
            >
              <FaArrowRight color="white" size={20} />
            </motion.div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <SearchFilter allPokemon={pokemonNames} />
          {loading ? (
            <PokeCardSkeleton />
          ) : (
            <PokeCard
              id={showcasePokemon!.id}
              slug={showcasePokemon!.slug}
              nationalNumber={showcasePokemon!.nationalNumber}
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
      </div>
    </section>
  )
}

export default Pokedex
