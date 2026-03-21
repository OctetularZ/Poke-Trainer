import React from "react"

interface HealthBarProps {
  currentHP: number
  maxHP: number
}

const getHpColor = (percentage: number) => {
  if (percentage > 50)
    return "bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-400"
  if (percentage > 20) return "bg-yellow-400"
  return "bg-red-500"
}

const HealthBar = ({ currentHP, maxHP }: HealthBarProps) => {
  const percentage = Math.max(0, (currentHP / maxHP) * 100)
  const color = getHpColor(percentage)

  return (
    <div className="flex flex-col items-center">
      <div className="w-[300px]">
        <h4 className="w-[250px] text-center text-black text-3xl font-bold [text-shadow:1px_1px_0_#fff,-1px_1px_0_#fff,1px_-1px_0_#fff,-1px_-1px_0_#fff]">
          CHARIZARD
        </h4>
        <div className="relative w-[300px] h-4">
          {/* Extended background (goes further right) */}
          <div className="absolute inset-y-0 left-0 w-full bg-gray-500 rounded-md" />

          {/* Actual HP bar container */}
          <div className="absolute inset-y-0 left-0 z-10 w-[250px] bg-white border-2 border-white rounded overflow-hidden">
            <div className="absolute inset-0 border border-neutral-500 pointer-events-none z-10" />

            <div
              className={`h-full transition-all duration-500 ease-in-out ${color}`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* HP text in the extended area */}
          <h1 className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-sm font-bold z-20 text-shadow-black text-shadow-xs">
            {percentage}%
          </h1>
        </div>
      </div>
    </div>
  )
}

export default HealthBar
