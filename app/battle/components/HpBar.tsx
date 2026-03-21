import React from "react"
import Image from "next/image"

interface HpBarInterface {
  pokemonName: string
  pokemonLevel: string
  currentHp: number
  maxHp: number
}

const HpBar = () => {
  return (
    <div>
      <Image
        src={"/stages/HP_Bar/Hp_Box_Left.png"}
        width={300}
        height={120}
        alt="HP_Box_Player"
      />
    </div>
  )
}

export default HpBar
