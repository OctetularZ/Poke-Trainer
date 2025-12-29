import { PokemonStats } from "@/types/stats"
import React from "react"
import StatBar from "./StatBar"

interface PokemonStatsProps {
  loading: boolean
  stats: PokemonStats
}

const PokemonStatsSection = ({ loading, stats }: PokemonStatsProps) => {
  return (
    !loading && (
      <div className="flex flex-col gap-5 justify-center items-end mb-20">
        <h1 className="text-white text-2xl self-start mb-5 border-b-2">
          Base Stats
        </h1>
        {Object.entries(stats)
          .filter(([key]) => key.includes("Base"))
          .map(([key, value]) => (
            <StatBar key={key} statName={key} baseStat={value} />
          ))}
      </div>
    )
  )
}

export default PokemonStatsSection
