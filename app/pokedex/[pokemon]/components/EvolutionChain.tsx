import React from "react"
import { Pokemon } from "@/types/pokemon"
import PokeCard from "../../components/PokeCard"
import { HiArrowLongRight } from "react-icons/hi2"
import { EvolutionTree } from "@/types/evolution"

interface PokemonData {
  evolutionTree: EvolutionTree
  loading: boolean
}

// Flatten the evolution tree into an array
const flattenEvolutionTree = (tree: EvolutionTree): EvolutionTree[] => {
  const result: EvolutionTree[] = [tree]

  if (tree.evolutions && tree.evolutions.length > 0) {
    tree.evolutions.forEach((evo) => {
      result.push(...flattenEvolutionTree(evo.pokemon))
    })
  }

  return result
}

const EvolutionChain = ({ evolutionTree, loading }: PokemonData) => {
  const flatEvolutions = evolutionTree
    ? flattenEvolutionTree(evolutionTree)
    : []

  return (
    !loading && (
      <div className="flex flex-col justify-center items-center mb-20">
        <h2 className="text-white text-center text-2xl ">Evolution Chain :</h2>
        <HiArrowLongRight color="white" size={40} className="mb-5" />
        <div className="flex flex-row flex-wrap justify-center items-center w-250">
          {flatEvolutions.map((pokemon) => (
            <div key={pokemon.id} className="mx-5">
              <PokeCard
                id={pokemon.id}
                slug={pokemon.slug || ""}
                nationalNumber={pokemon.nationalNumber || ""}
                name={pokemon.name}
                sprite={
                  pokemon.sprites?.other?.showdown?.front_default ||
                  pokemon.sprites?.front_default ||
                  "/placeholder.png"
                }
                types={pokemon.types!}
              />
            </div>
          ))}
        </div>
      </div>
    )
  )
}

export default EvolutionChain
