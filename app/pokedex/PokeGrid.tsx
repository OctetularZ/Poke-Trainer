import React from "react"
import PokeCard from "./PokeCard"

const PokeGrid = () => {
  return (
    <div className="flex flex-row flex-wrap gap-25">
      <PokeCard />
      <PokeCard />
      <PokeCard />
    </div>
  )
}

export default PokeGrid
