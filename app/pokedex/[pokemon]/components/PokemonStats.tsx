import { PokemonStat } from "@/types/stats"
import React from "react"
import StatBar from "./StatBar"

interface PokemonStatsProps {
  loading: boolean
  stats: PokemonStat[]
}

const PokemonStats = ({ loading, stats }: PokemonStatsProps) => {
  return (
    !loading && (
      <div className="flex flex-col gap-5 justify-center items-end mb-20">
        <h1 className="text-white text-2xl self-start mb-5 border-b-2">
          Base Stats
        </h1>
        {stats.map((stat) => (
          <StatBar
            key={stat.stat.name}
            statName={stat.stat.name}
            baseStat={stat.base_stat}
          />
        ))}
      </div>
    )
  )
}

export default PokemonStats
