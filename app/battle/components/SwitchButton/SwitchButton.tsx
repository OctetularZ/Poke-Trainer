import { BattlePokemon } from "@/lib/battle"
import { PokemonSprites } from "@/types/pokemon"
import React from "react"

interface SwitchButtonProps {
  disabled: boolean
  onClick: () => void
  pokemon: BattlePokemon
}

const getHpColor = (percentage: number) => {
  if (percentage > 50)
    return "bg-gradient-to-t from-green-800 via-green-500 to-green-300"
  if (percentage > 20)
    return "bg-gradient-to-t from-yellow-800 via-yellow-500 to-yellow-300"
  return "bg-gradient-to-t from-red-800 via-red-500 to-red-300"
}

const SwitchButton = ({ disabled, onClick, pokemon }: SwitchButtonProps) => {
  const percentage =
    pokemon.maxHp > 0
      ? Math.max(0, Math.min(100, (pokemon.currentHp / pokemon.maxHp) * 100))
      : 0
  const roundedPercentage = Math.round(percentage)
  const color = getHpColor(roundedPercentage)

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="relative flex flex-col items-start bg-gray-500 py-1 rounded-md hover:scale-105 hover:bg-gray-400 transition-all disabled:opacity-40 disabled:hover:scale-100"
    >
      <div className="flex flex-row items-center">
        <img
          src={
            pokemon.sprites?.front_default ||
            pokemon.sprites?.other["official-artwork"].front_default ||
            "/placeholder.png"
          }
          width={50}
          height={50}
        />
        <h1 className="text-white text-md">{pokemon.name}</h1>
      </div>

      <div className="absolute inset-x-1 bottom-1 h-2 bg-white border border-neutral-500 rounded overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-in-out ${color}`}
          style={{ width: `${roundedPercentage}%` }}
        />
      </div>
    </button>
  )
}

export default SwitchButton
