import { TypeEffectiveness } from "@/types/type"
import React from "react"
import { typeColours } from "../../components/typeColours"

interface TypeChartProps {
  typeChart: TypeEffectiveness[]
  loading: boolean
}

const allTypes = [
  "Normal",
  "Fire",
  "Water",
  "Electric",
  "Grass",
  "Ice",
  "Fighting",
  "Poison",
  "Ground",
  "Flying",
  "Psychic",
  "Bug",
  "Rock",
  "Ghost",
  "Dragon",
  "Dark",
  "Steel",
  "Fairy",
]

const valBgColour = {
  4: "bg-emerald-500",
  2: "bg-green-500",
  1: "bg-amber-50",
  0: "bg-black",
  0.5: "bg-red-700",
  0.25: "bg-red-900",
}

function toFraction(num: string) {
  if (num === "½") return 0.5
  if (num === "¼") return 0.25
  return parseInt(num)
}

const TypeChart = ({ typeChart, loading }: TypeChartProps) => {
  if (!loading) {
    const effectivenessMap = Object.fromEntries(
      typeChart.map((te) => [te.attackType, te.multiplier])
    )

    const merged = allTypes.map((type) => ({
      attackType: type,
      multiplier: effectivenessMap[type] ?? 1,
    }))

    return (
      <div className="flex flex-col items-start">
        <h1 className="text-white text-2xl border-b-2 mb-10">Type Defenses</h1>
        <div className="flex flex-row flex-wrap max-w-115 gap-0.25">
          {merged.map((typeEffectiveness) => (
            <div
              key={typeEffectiveness.attackType}
              className="flex flex-col justify-center items-center"
            >
              <div
                className={`flex w-12 h-12 ${
                  typeColours[
                    typeEffectiveness.attackType.toLowerCase() as keyof typeof typeColours
                  ]
                } justify-center items-center`}
              >
                <h1 className="text-center text-white text-shadow-[0_0_3px_rgb(0_0_0_/_1)]">
                  {typeEffectiveness.attackType.slice(0, 3).toUpperCase()}
                </h1>
              </div>
              <div
                className={`flex w-12 h-12 ${
                  valBgColour[
                    toFraction(
                      typeEffectiveness.multiplier
                    ) as keyof typeof valBgColour
                  ]
                } justify-center items-center border-t-1`}
              >
                <h4 className="text-center text-amber-300 text-lg text-shadow-[0_0_2px_rgb(0_0_0_/_1)]">
                  {toFraction(typeEffectiveness.multiplier)}
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
