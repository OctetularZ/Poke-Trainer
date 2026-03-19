import { BattlePokemon } from "@/lib/battle"
import Image from "next/image"
import React from "react"

interface StageProps {
  attackerPokemon: BattlePokemon
  defenderPokemon: BattlePokemon
}

const Stage = ({ attackerPokemon, defenderPokemon }: StageProps) => {
  return (
    <div className="flex justify-center mt-20">
      <Image
        src={"/stages/sand_mines.png"}
        width={700}
        height={700}
        alt="sand-mines"
      />
    </div>
  )
}

export default Stage
