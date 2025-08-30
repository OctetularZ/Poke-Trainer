import Image from "next/image"
import Link from "next/link"
import React from "react"
import { PokemonType } from "../api/all_pokemon/route"
import { typeColours } from "./typeColours"

interface Pokemon {
  id: number
  name: string
  sprite: string
  types: PokemonType[]
}

const PokeCard = ({ id, name, sprite, types }: Pokemon) => {
  return (
    <Link href={"#"}>
      <div className="flex flex-col justify-center items-center w-55 bg-charmander-dull-200 rounded-2xl pt-10 pb-8 px-5">
        <div className="relative mb-5 w-[100px] h-[100px] items-center">
          <Image
            className="object-contain"
            src={sprite}
            fill
            alt="pokemon name"
            unoptimized={true}
          />
        </div>
        <p className="text-gray-400">#{id}</p>
        <h1 className="text-white text-2xl pb-3 text-wrap">{name}</h1>
        <div className="flex flex-row gap-5">
          {types.map((type: PokemonType, index) => (
            <h4
              key={index}
              className={`text-white text-xl ${
                typeColours[type.type.name as keyof typeof typeColours]
              } rounded-lg px-3`}
            >
              {`${type.type.name.charAt(0).toUpperCase()}${type.type.name.slice(
                1
              )}`}
            </h4>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default PokeCard
