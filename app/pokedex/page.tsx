import React from "react"
import PokeGrid from "./PokeGrid"
import Filter from "./Filter"

const Pokedex = () => {
  return (
    <div className="flex flex-col justify-center justify-self-center items-center gap-5 py-5 w-10/12 bg-blue-700">
      <h1 className="text-white text-6xl mt-10 mb-5">Pokedex</h1>
      <Filter />
      <PokeGrid />
    </div>
  )
}

export default Pokedex
