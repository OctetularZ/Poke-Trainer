import { BattlePokemon } from "@/lib/battle"
import Image from "next/image"
import React from "react"
import HealthBar from "./HealthBar"

interface StageProps {
  turnNumber: number
  attackerPokemon: BattlePokemon
  defenderPokemon: BattlePokemon
}

const Stage = ({
  turnNumber,
  attackerPokemon,
  defenderPokemon,
}: StageProps) => {
  return (
    <div className="relative flex w-200 h-133 justify-center mt-10 overflow-hidden border-1 border-amber-100">
      <Image
        src={"/stages/sand_mines.png"}
        className="object-contain"
        fill
        alt="sand-mines"
      />

      <div className="absolute bg-amber-50 border-3 border-black px-2 font-bold text-2xl rounded-md top-5 left-5">
        <h1>Turn {turnNumber}</h1>
      </div>

      <div className="flex flex-col items-center absolute bottom-20 left-20 z-10 gap-15">
        <HealthBar
          pokemonName={attackerPokemon.name}
          currentHP={attackerPokemon.currentHp}
          maxHP={attackerPokemon.maxHp}
        />
        <img
          className="w-auto h-50"
          src={
            attackerPokemon.sprites?.other.showdown.back_default ||
            attackerPokemon.sprites?.back_default
          }
        />
      </div>

      <div className="flex flex-col items-center absolute top-8 right-12 z-10 gap-15">
        <HealthBar
          percentageOnLeft={true}
          pokemonName={defenderPokemon.name}
          currentHP={defenderPokemon.currentHp}
          maxHP={defenderPokemon.maxHp}
        />
        <img
          className="w-auto h-30"
          // Change this to defenderPokemon when ai Pokemon team set with sprites
          src={
            defenderPokemon.sprites?.other.showdown.front_default ||
            defenderPokemon.sprites?.front_default
          }
        />
      </div>
    </div>
  )
}

export default Stage
