import { PokemonSprites } from "@/types/pokemon"
import React from "react"

interface SwitchButtonProps {
  disabled: boolean
  onClick: () => void
  pokemonName: string
  pokemonSprites: PokemonSprites
  currentHp: number
  maxHp: number
}

const SwitchButton = ({
  disabled,
  onClick,
  pokemonName,
  pokemonSprites,
  currentHp,
  maxHp,
}: SwitchButtonProps) => {
  return (
    <div className="relative flex flex-row items-center">
      <img
        src={
          pokemonSprites.front_default ||
          pokemonSprites.other["official-artwork"].front_default
        }
      />
      <h1 className="text-white text-lg">{pokemonName}</h1>

      {/* Put hp bar here and make it absolute positioned */}
    </div>
  )
}

export default SwitchButton
