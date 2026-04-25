"use client"
import { Pokemon } from "@/types/pokemon"
import { motion, Variants } from "motion/react"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { FaArrowRight } from "react-icons/fa6"
import Image from "next/image"

const GuessThePokemon = () => {
  const [showcasePokemon, setShowcasePokemon] = useState<Pokemon>()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const fetchPokemon = async () => {
      const res = await fetch("/api/pokemon/pikachu")

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
    <section id={"guess-the-pokemon"} className="flex flex-col items-center">
      <div className="flex flex-row flex-wrap justify-center pb-20 gap-40 items-center pt-30">
        <div className="flex flex-col justify-center items-center border-2 border-amber-100 bg-gray-700 rounded-xl p-20">
          {loading ? (
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
                width={100}
                height={100}
                alt="pixel-great-ball-loading"
              ></Image>
            </motion.div>
          ) : (
            <img
              className="w-auto h-50 brightness-0"
              src={
                showcasePokemon?.sprites.other.showdown.front_default ||
                showcasePokemon?.sprites.front_default ||
                "/placeholder.png"
              }
            />
          )}
        </div>
        <div className="flex flex-col justify-center items-center max-w-150">
          <h1 className="text-white text-5xl pb-5">Guess The Pokémon</h1>
          <h2 className="text-white/60 text-xl text-center text-highlight">
            <mark>Test your Pokédex knowledge</mark> in the Guess The Pokémon
            mini game. Identify Pokémon from their silhouettes and clues (should
            you need them...) to{" "}
            <span className="text-white">
              earn rewards and prove to your friends that you're a real fan of
              Pokémon
            </span>
            . From first gen all the way to the current generation, this game
            will truly test the depths of your Pokédex knowledge.
          </h2>
          <div className="flex flex-row gap-3 mt-10 justify-center items-center">
            <Link href={"/guess-the-pokemon"}>
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
                Play
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
      </div>
    </section>
  )
}

export default GuessThePokemon
