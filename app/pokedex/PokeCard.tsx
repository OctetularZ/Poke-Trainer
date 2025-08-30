import Image from "next/image"
import Link from "next/link"
import React from "react"

interface Props {}

const PokeCard = () => {
  return (
    <Link href={"#"}>
      <div className="flex flex-col justify-center items-center bg-charmander-dull-200 rounded-2xl pt-10 pb-8 px-5">
        <Image
          className="pb-5"
          src={"/clefairy.gif"}
          height={100}
          width={100}
          alt="pokemon name"
          unoptimized={true}
        />
        <h1 className="text-white text-2xl pb-3 text-wrap">Pokemon Name</h1>
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
