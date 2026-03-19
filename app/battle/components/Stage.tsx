import { BattlePokemon } from "@/lib/battle"
import Image from "next/image"
import React from "react"

interface StageProps {
  attackerPokemon: BattlePokemon
  defenderPokemon: BattlePokemon
}

const Stage = ({ attackerPokemon, defenderPokemon }: StageProps) => {
  return (
    <div className="relative flex w-200 h-150 justify-center mt-10 overflow-hidden">
      <Image
        src={"/stages/sand_mines.png"}
        className="object-contain"
        fill
        alt="sand-mines"
      />

      <img
        className="absolute bottom-25 left-40 z-10 w-auto h-40"
        src={
          attackerPokemon.sprites?.other.showdown.back_default ||
          attackerPokemon.sprites?.back_default
        }
      />

      <img
        className="absolute top-45 right-35 z-10 w-auto h-30"
        // Change this to defenderPokemon when ai Pokemon team set with sprites
        src={
          attackerPokemon.sprites?.other.showdown.front_default ||
          attackerPokemon.sprites?.front_default
        }
      />
    </div>
  )
}

export default Stage
