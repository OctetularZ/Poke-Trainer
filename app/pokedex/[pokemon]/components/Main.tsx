"use client"
import React, { useEffect, useState } from "react"
import { PokemonInfo } from "@/app/api/pokemon/[name]/route"
import { motion } from "motion/react"
import Image from "next/image"

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
        data?.sprites.other.showdown.front_default,
        data?.sprites.other.showdown.back_default,
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
    <div className="relative flex flex-row justify-center items-center bg-charmander-dull-200 w-200 h-150 rounded-xl my-20">
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
            className="justify-self-center"
            src={"/placeholder.png"}
            width={100}
            height={100}
            alt="Placeholder"
          />
        </motion.div>
      ) : (
        <div>
          <div>
            <div className="flex flex-row gap-3 mb-30 text-center text-5xl">
              <h1 className=" text-white">
                {pokemon.charAt(0).toUpperCase()}
                {pokemon.slice(1)}
              </h1>
              <h1 className="text-white/50">
                #{pokemonInfo?.id.toString().padStart(4, "0")}
              </h1>
            </div>
            <p>{pokemonInfo?.species.flavor_text_entries[0].flavor_text}</p>
            <Image
              className="relative -translate-x-15"
              src={
                pokemonInfo?.sprites.other["official-artwork"].front_default!
              }
              width={350}
              height={350}
              alt={`${pokemon} Sprite`}
              unoptimized
            />
          </div>
          <div className="absolute bottom-2 right-2 px-2 max-h-[calc(100%-0.5rem)] overflow-y-scroll">
            {sprites?.map((sprite) => (
              <div
                key={sprite}
                className="flex justify-center items-center bg-charmander-blue-900 w-40 h-45 mb-2 rounded-lg shadow-sm shadow-black"
              >
                <Image
                  src={sprite}
                  width={125}
                  height={125}
                  alt="Pokémon Sprite"
                  unoptimized
                />
              </div>
            ))}
          </div>
          {/* <Image
            src={pokemonInfo?.sprites.other.showdown.front_default!}
            width={100}
            height={100}
            alt={`${pokemon} Sprite`}
            unoptimized={true}
          /> */}
          {/* Store sprites in a hashmap, update order each time a user clicks a sprite. Display hashmap[1] as the main image */}
        </div>
      )}
    </div>
  )
}

export default Main
