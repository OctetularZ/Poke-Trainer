import { BattlePokemon } from "@/lib/battle"
import { PokemonSprites } from "@/types/pokemon"
import React from "react"
import SwitchPopUp from "./SwitchPopUp"

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
    <div className="group relative">
      <SwitchPopUp pokemon={pokemon} />

      <button
        disabled={disabled}
        onClick={onClick}
        className="relative flex w-full flex-col items-start rounded-sm bg-gray-500 py-1 transition-all hover:scale-105 hover:bg-gray-400 disabled:opacity-40 disabled:hover:scale-100"
      >
        <div className="flex flex-row items-center w-[95%]">
          <img
            src={
              pokemon.sprites?.front_default ||
              pokemon.sprites?.other["official-artwork"].front_default ||
              "/placeholder.png"
            }
            width={40}
            height={40}
          />
          <h1 className="text-white text-md text-left truncate">
            {pokemon.name}
          </h1>
        </div>

        <div className="absolute inset-x-1 bottom-1 h-2 overflow-hidden rounded border border-neutral-500 bg-white shadow-2xs/50 shadow-black">
          <div
            className={`h-full transition-all duration-500 ease-in-out ${color}`}
            style={{ width: `${roundedPercentage}%` }}
          />
        </div>
      </button>
    </div>
  )
}

export default SwitchButton
