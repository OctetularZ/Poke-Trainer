import React from "react"
import PokeCard from "../../components/PokeCard"
import { HiArrowLongRight } from "react-icons/hi2"
import { EvolutionTree } from "@/types/evolution"

interface PokemonData {
  evolutionTree: EvolutionTree
  loading: boolean
}

interface EvolutionNodeProps {
  node: EvolutionTree
}

// Recursive component to render evolution tree
const EvolutionNode = ({ node }: EvolutionNodeProps) => {
  const hasEvolutions = node.evolutions && node.evolutions.length > 0

  return (
    <div className="flex flex-row items-center gap-3">
      {/* Current Pokemon */}
      <PokeCard
        id={node.id}
        slug={node.slug || ""}
        nationalNumber={node.nationalNumber || ""}
        name={node.name}
        sprite={
          node.sprites?.other?.showdown?.front_default ||
          node.sprites?.front_default ||
          "/placeholder.png"
        }
        types={node.types || []}
      />

      {/* Evolutions */}
      {hasEvolutions && (
        <div className="flex flex-row items-center gap-3">
          <div className="flex flex-col gap-8 items-start">
            {node.evolutions.map((evo, idx) => (
              <div key={idx} className="flex flex-row items-center gap-1">
                <div className="flex flex-row items-center w-30">
                  <HiArrowLongRight color="white" size={30} />
                  <p className="text-white text-xs text-center w-20">
                    {evo.method}
                  </p>
                </div>
                <EvolutionNode node={evo.pokemon} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const EvolutionChain = ({ evolutionTree, loading }: PokemonData) => {
  return (
    !loading && (
      <div className="flex flex-col justify-center items-center mb-20">
        <h2 className="text-white text-center text-2xl mb-5">
          Evolution Chain
        </h2>
        <div className="flex justify-center items-start w-full overflow-x-auto px-5">
          <EvolutionNode node={evolutionTree} />
        </div>
      </div>
    )
  )
}

export default EvolutionChain
