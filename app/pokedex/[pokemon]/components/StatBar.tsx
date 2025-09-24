import React from "react"

interface StatBarProps {
  statName: string
  baseStat: number
}

const maxStat = 180

const StatBar = ({ statName, baseStat }: StatBarProps) => {
  const barPercentage = Math.min((baseStat / maxStat) * 100, 100)

  let colorClass = "bg-green-500"

  if (baseStat < 25) {
    colorClass = "bg-red-500"
  } else if (baseStat >= 25 && baseStat < 50) {
    colorClass = "bg-orange-500"
  } else if (baseStat >= 50 && baseStat < 100) {
    colorClass = "bg-yellow-400"
  } else if (baseStat >= 100 && baseStat < 125) {
    colorClass = "bg-green-500"
  } else {
    colorClass = "bg-emerald-500"
  }

  return (
    <div className="flex flex-row gap-5">
      <h2 className="text-lg text-white">
        {statName.charAt(0).toUpperCase()}
        {statName.slice(1).replace("-", " ")}
      </h2>
      <div className={`bg-gray-300 w-100 rounded-lg`}>
        <div
          className={`rounded-lg text-white p-1 ${colorClass}`}
          style={{ width: `${barPercentage}%` }}
        >
          <p className="ml-1">{baseStat}</p>
        </div>
      </div>
    </div>
  )
}

export default StatBar
