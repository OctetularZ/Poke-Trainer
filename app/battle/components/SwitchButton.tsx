import { PokemonSprites } from "@/types/pokemon"
import React from "react"

interface SwitchButtonProps {
  disabled: boolean
  onClick: () => void
  pokemonName: string
  pokemonSprites?: PokemonSprites
  currentHp: number
  maxHp: number
}

const getHpColor = (percentage: number) => {
  if (percentage > 50)
    return "bg-gradient-to-t from-green-800 via-green-500 to-green-300"
  if (percentage > 20) return "bg-yellow-400"
  return "bg-red-500"
}

const SwitchButton = ({
  disabled,
  onClick,
  pokemonName,
  pokemonSprites,
  currentHp,
  maxHp,
}: SwitchButtonProps) => {
  const percentage =
    maxHp > 0 ? Math.max(0, Math.min(100, (currentHp / maxHp) * 100)) : 0
  const roundedPercentage = Math.round(percentage)
  const color = getHpColor(roundedPercentage)

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="relative flex flex-col items-center bg-gray-500 px-2 py-1 rounded-md hover:scale-105 hover:bg-gray-400 transition-all disabled:opacity-40 disabled:hover:scale-100"
    >
      <div className="flex flex-row items-center">
        <img
          src={
            pokemonSprites?.front_default ||
            pokemonSprites?.other["official-artwork"].front_default ||
            "/placeholder.png"
          }
          width={50}
          height={50}
        />
        <h1 className="text-white text-lg">{pokemonName}</h1>
      </div>

      <div className="absolute w-[95%] bottom-1 h-2 bg-white border border-neutral-500 rounded overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-in-out ${color}`}
          style={{ width: `${roundedPercentage}%` }}
        />
      </div>
    </button>
  )
}

export default SwitchButton
