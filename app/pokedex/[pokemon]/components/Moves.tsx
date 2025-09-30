import { Move } from "@/types/moves"
import React from "react"

interface PokemonMoves {
  loading: boolean
  pokemonMoves: Move[]
}

const Moves = ({ loading, pokemonMoves }: PokemonMoves) => {
  return (
    <div className="flex flex-col justify-center items-center">
      {!loading &&
        pokemonMoves.map((move) => (
          <div
            key={move.id}
            className="flex flex-row justify-center items-center"
          >
            <h1 className="text-white text-2xl">
              {move.name.charAt(0).toUpperCase() +
                move.name.slice(1).replace("-", " ")}
            </h1>
          </div>
        ))}
    </div>
  )
}

export default Moves
