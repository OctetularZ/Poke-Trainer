"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { motion, Variants } from "motion/react"
import { PokemonInfo } from "@/app/api/pokemon/[name]/route"
import PokeCard from "@/app/pokedex/components/PokeCard"
import PokeCardSkeleton from "../skeletons/PokeCardSkeleton"
import { FaArrowRight } from "react-icons/fa6"
import allPokemonNames from "@/data/pokemon-names.json"
import SearchFilter from "@/app/pokedex/components/SearchFilter"

const Pokedex = () => {
  const [showcasePokemon, setShowcasePokemon] = useState<PokemonInfo>()
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [error, setError] = useState("")
  const [filteredPokemonNames, setFilteredPokemonNames] =
    useState<string[]>(allPokemonNames)

  useEffect(() => {
    const fetchPokemon = async () => {
      const res = await fetch("/api/pokemon/Dragapult")

      if (!res.ok) {
        console.error("Couldn't fetch showcase pokemon!")
        setError("Couldn't fetch showcase pokemon!")
        return
      }

      const data: PokemonInfo = await res.json()

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
      <div className="flex flex-row flex-wrap justify-center pb-20 gap-40 items-center pt-30">
        <div className="flex flex-col justify-center items-center max-w-150">
          <h1 className="text-white text-5xl pb-5">Pokédex</h1>
          <h2 className="text-white/60 text-xl text-center text-highlight">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor
            quidem ratione enim. Voluptatum officiis quaerat omnis eaque
            tempore! Autem, praesentium ut. Sunt fugiat aliquid expedita a
            cupiditate iusto ex exercitationem. Quos possimus doloribus ea ullam
            veritatis! <mark>Placeat enim beatae</mark> fugit sed tempora
            mollitia, modi deleniti cupiditate optio corporis voluptatum
            officiis dignissimos error itaque laboriosam ipsa quam reiciendis
            ullam facere deserunt?
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
                className="py-2 px-5 rounded-md bg-white cursor-pointer"
              >
                Visit Pokédex
              </motion.button>
            </Link>
            <motion.div
              className="-z-5"
              variants={arrowVariants}
              initial="initial"
              animate={hovered ? "hover" : "initial"}
            >
              <FaArrowRight color="white" size={20} />
            </motion.div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <SearchFilter allPokemonNames={filteredPokemonNames} />
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
      </div>
    </section>
  )
}

export default Pokedex
