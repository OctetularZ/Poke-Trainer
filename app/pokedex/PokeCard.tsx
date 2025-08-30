import Image from "next/image"
import Link from "next/link"
import React from "react"

interface Pokemon {
  id: number
  name: string
  sprite: string
  // types: string[]
}

const PokeCard = ({ id, name, sprite }: Pokemon) => {
  return (
    <Link href={"#"}>
      <div className="flex flex-col justify-center items-center bg-charmander-dull-200 rounded-2xl pt-10 pb-8 px-5">
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
          <h4 className="text-white text-xl bg-fuchsia-400 rounded-lg px-3">
            Type 1
          </h4>
          <h4 className="text-white text-xl bg-emerald-400 rounded-lg px-3">
            Type 2
          </h4>
        </div>
      </div>
    </Link>
  )
}

export default PokeCard
