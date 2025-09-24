import { TypeInfo } from "@/types/type"
import React from "react"

interface TypeChartProps {
  typeInfo: TypeInfo[]
  loading: boolean
}

function calculateTypeEffectiveness(types: TypeInfo[]) {
  const multipliers: Record<string, number> = {}

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

const TypeChart = ({ typeInfo, loading }: TypeChartProps) => {
  if (!loading) {
    const types = calculateTypeEffectiveness(typeInfo)

    return (
      <div className="flex flex-row max-w-100">
        {Object.entries(types).map(([key, val]) => (
          <h1 className="text-white">
            {key}: {val}
          </h1>
        ))}
      </div>
    )
  }
}

export default TypeChart
