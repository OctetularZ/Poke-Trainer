"use client"
import React, { useEffect, useState } from "react"
import { PokemonInfo } from "@/app/api/pokemon/[name]/route"
import Image from "next/image"

interface Props {
  pokemon: string
}

const Main = ({ pokemon }: Props) => {
  const [pokemonInfo, setPokemonInfo] = useState<PokemonInfo>()
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
    <div className="flex flex-row justify-center items-center bg-charmander-dull-200 w-200 h-150 rounded-xl my-20">
      {/* {!loading && <h1 className="text-white">Pokemon: {pokemonInfo?.id}</h1>} */}
      {loading ? (
        <Image
          className="justify-self-center"
          src={"/placeholder.png"}
          width={100}
          height={100}
          alt="Placeholder"
        />
      ) : (
        <>
          <Image
            src={pokemonInfo?.sprites.other["official-artwork"].front_default!}
            width={300}
            height={300}
            alt={`${pokemon} Sprite`}
            unoptimized={true}
          />
          {/* <Image
            src={pokemonInfo?.sprites.other.showdown.front_default!}
            width={100}
            height={100}
            alt={`${pokemon} Sprite`}
            unoptimized={true}
          /> */}
        </>
      )}
    </div>
  )
}

export default Main
