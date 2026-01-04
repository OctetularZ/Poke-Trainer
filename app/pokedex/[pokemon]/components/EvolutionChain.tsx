import React from "react"
import PokeCard from "../../components/PokeCard"
import { HiArrowLongRight } from "react-icons/hi2"
import { EvolutionTree, Evolution } from "@/types/evolution"

interface PokemonData {
  evolutionTree: EvolutionTree
  loading: boolean
}

interface EvolutionNodeProps {
  node: EvolutionTree
}

// Categorize evolution method by keywords
const categorizeEvolutionMethod = (method: string): string => {
  const lowerMethod = method.toLowerCase()

  // Check possible evolution methods and separate them
  if (lowerMethod.includes("near") || lowerMethod.includes("location"))
    return "Location"
  if (lowerMethod.includes("stone")) return "Stone"
  if (lowerMethod.includes("friendship") || lowerMethod.includes("affection"))
    return "Friendship"
  if (lowerMethod.includes("trade")) return "Trade"
  if (lowerMethod.includes("level")) return "Level"

  return "Other"
}

// Group evolutions by method
const groupEvolutions = (evolutions: Evolution[]): Evolution[][] => {
  // If 3 or fewer evolutions, just show
  if (evolutions.length <= 3) {
    return [evolutions]
  }

  // Create groups based on evolution methods
  const groups: Record<string, Evolution[]> = {}

  evolutions.forEach((evo) => {
    const category = categorizeEvolutionMethod(evo.method)
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(evo)
  })

  // Convert groups object to array of evolution arrays
  return Object.values(groups)
}

// Recursive component - Render evolution tree
const EvolutionNode = ({ node }: EvolutionNodeProps) => {
  const hasEvolutions = node.evolutions && node.evolutions.length > 0

  if (!hasEvolutions) {
    // Leaf node (no evolutions) - just show the Pokemon
    return (
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
    )
  }

  // Group the evolutions (splits if 4+, keeps together if 1-3)
  const evolutionGroups = groupEvolutions(node.evolutions)

  return (
    <div className="flex flex-row items-center gap-3">
      <div className="flex flex-col gap-8">
        {/* Render each group separately with its own parent Pokemon */}
        {evolutionGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="flex flex-row items-center gap-3">
            {/* Parent Pokemon for each group */}
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

            {/* Show evolutions in this group */}
            <div className="flex flex-col gap-3">
              {group.map((evo, idx) => (
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
        ))}
      </div>
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
