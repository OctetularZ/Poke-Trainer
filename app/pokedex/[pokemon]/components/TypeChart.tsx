import { TypeInfo } from "@/types/type"
import React from "react"
import { allPokemonTypes } from "@/data/pokemonTypes"
import { typeColours } from "../../components/typeColours"

interface TypeChartProps {
  typeInfo: TypeInfo[]
  loading: boolean
}

function calculateTypeEffectiveness(types: TypeInfo[]) {
  const multipliers: Record<string, number> = {}
  allPokemonTypes.forEach((type) => {
    multipliers[type] = 1
  })

  for (const type of types) {
    // Double damage (×2)
    type.damage_relations.double_damage_from.forEach((t) => {
      multipliers[t.name] = (multipliers[t.name] ?? 1) * 2
    })

    // Half damage (×0.5)
    type.damage_relations.half_damage_from.forEach((t) => {
      multipliers[t.name] = (multipliers[t.name] ?? 1) * 0.5
    })

    // Immunities (×0)
    type.damage_relations.no_damage_from.forEach((t) => {
      multipliers[t.name] = 0
    })
  }

  return multipliers
}

const valBgColour = {
  4: "bg-emerald-500",
  2: "bg-green-500",
  1: "bg-amber-50",
  0: "bg-black",
  0.5: "bg-red-700",
  0.25: "bg-red-900",
}

function toFraction(num: number) {
  if (num === 0.5) return "½"
  if (num === 0.25) return "¼"
  return num.toString()
}

const TypeChart = ({ typeInfo, loading }: TypeChartProps) => {
  if (!loading) {
    const types = calculateTypeEffectiveness(typeInfo)

    return (
      <div className="flex flex-col items-start">
        <h1 className="text-white text-2xl border-b-2 mb-10">Type Defenses</h1>
        <div className="flex flex-row flex-wrap max-w-115 gap-0.25">
          {Object.entries(types).map(([key, val]) => (
            <div
              key={key}
              className="flex flex-col justify-center items-center"
            >
              <div
                className={`flex w-12 h-12 ${
                  typeColours[key as keyof typeof typeColours]
                } justify-center items-center`}
              >
                <h1 className="text-center text-white text-shadow-[0_0_3px_rgb(0_0_0_/_1)]">
                  {key.slice(0, 3).toUpperCase()}
                </h1>
              </div>
              <div
                className={`flex w-12 h-12 ${
                  valBgColour[val as keyof typeof valBgColour]
                } justify-center items-center border-t-1`}
              >
                <h4 className="text-center text-amber-300 text-lg text-shadow-[0_0_2px_rgb(0_0_0_/_1)]">
                  {toFraction(val)}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default TypeChart
