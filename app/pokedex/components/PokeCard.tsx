import Image from "next/image"
import Link from "next/link"
import React from "react"
import { PokemonType } from "@/types/type"
import { typeColours, typeColoursHex } from "./typeColours"
import { getPokemonSlug } from "@/lib/pokeapi/helpers/getPokemonSlug"

interface Pokemon {
  id: number
  slug: string
  nationalNumber: string
  name: string
  sprite: string
  types: PokemonType[]
}

const PokeCard = ({
  id,
  slug,
  nationalNumber,
  name,
  sprite,
  types,
}: Pokemon) => {
  const baseName = name.split("(")[0].trim()
  const formName = name.includes("(")
    ? name.split("(")[1].replace(")", "").trim()
    : ""

  return (
    <Link href={`/pokedex/${slug}`}>
      <div className="flex flex-col justify-center items-center w-55 h-full bg-charmander-dull-200 rounded-2xl pt-10 pb-8 px-5">
        <div className="relative mb-5 w-[100px] h-[100px] items-center">
          <Image
            className="object-contain"
            src={sprite}
            fill
            alt="pokemon name"
            unoptimized={true}
          />
        </div>
        <p className="text-gray-400">
          #{nationalNumber.toString().padStart(4, "0")}
        </p>
        <h1 className="text-white text-2xl text-wrap text-center">
          {baseName.replace(/\b\w/g, (char) => char.toUpperCase())}
        </h1>
        <h1 className="text-gray-400 text-xl pb-3 text-wrap text-center">
          {formName.replace(/\b\w/g, (char) => char.toUpperCase())}
        </h1>
        <div className="flex flex-row gap-5">
          {types.map((type: PokemonType, index) => (
            <h4
              key={index}
              className={`text-white text-xl ${
                typeColours[type.name.toLowerCase() as keyof typeof typeColours]
              } rounded-lg px-3 shadow-md`}
              style={{
                filter: `drop-shadow(0 0 8px ${
                  typeColoursHex[
                    type.name.toLowerCase() as keyof typeof typeColoursHex
                  ]
                })`,
              }}
            >
              {`${type.name.charAt(0).toUpperCase()}${type.name.slice(1)}`}
            </h4>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default PokeCard
