import React from "react"

interface StatBarProps {
  statName: string
  baseStat: number
}

const StatBar = ({ statName, baseStat }: StatBarProps) => {
  return (
    <div className="flex flex-row gap-5">
      <h2 className="text-lg text-white">{statName}</h2>
      <div className="bg-gray-300 w-100 rounded-lg">
        <div className="bg-amber-400 rounded-lg text-white p-1 w-[60%]">
          80%
        </div>
      </div>
    </div>
  )
}

export default StatBar
