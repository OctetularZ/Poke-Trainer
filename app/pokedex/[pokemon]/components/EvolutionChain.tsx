import React from "react"
import { PokemonInfo } from "@/types/pokemonFull"
import PokeCard from "../../components/PokeCard"
import { HiArrowLongRight } from "react-icons/hi2"

interface PokemonData {
  pokemonInfo: PokemonInfo
  loading: boolean
}

const EvolutionChain = ({ pokemonInfo, loading }: PokemonData) => {
  return (
    !loading && (
      <div className="flex flex-col justify-center items-center mb-20">
        <h2 className="text-white text-center text-2xl ">Evolution Chain :</h2>
        <HiArrowLongRight color="white" size={40} className="mb-5" />
        <div className="flex flex-row flex-wrap justify-center items-center w-250">
          {pokemonInfo?.evolution_chain.map((pokemon) => (
            <div key={pokemon.id} className="mx-5">
              <PokeCard
                id={pokemon.id}
                name={pokemon.name}
                sprite={
                  pokemon.showdown.front_default ||
                  pokemon.sprites.front_default ||
                  "/placeholder.png"
                }
                types={pokemon.types}
              />
            </div>
          ))}
        </div>
      </div>
    )
  )
}

export default EvolutionChain
