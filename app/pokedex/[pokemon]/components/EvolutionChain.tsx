import React from "react"
import { Pokemon } from "@/types/pokemon"
import PokeCard from "../../components/PokeCard"
import { HiArrowLongRight } from "react-icons/hi2"

interface PokemonData {
  pokemon: Pokemon
  loading: boolean
}

const EvolutionChain = ({ pokemon, loading }: PokemonData) => {
  return (
    !loading && (
      <div className="flex flex-col justify-center items-center mb-20">
        <h2 className="text-white text-center text-2xl ">Evolution Chain :</h2>
        <HiArrowLongRight color="white" size={40} className="mb-5" />
        <div className="flex flex-row flex-wrap justify-center items-center w-250">
          {pokemon?.evolution_chain.map((pokemon) => (
            <div key={pokemon.id} className="mx-5">
              <PokeCard
                id={pokemon.id}
                slug={pokemon.slug}
                nationalNumber={pokemon.nationalNumber}
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
