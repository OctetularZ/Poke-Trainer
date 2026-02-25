"use client"

import { PokemonAbility } from "@/types/ability"
import { Pokemon } from "@/types/pokemon"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect } from "react"

interface PokemonStatSetterProps {
  selectedPokemon: Pokemon | null
}

export default function PokemonStatSetter({
  selectedPokemon,
}: PokemonStatSetterProps) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedAbility, setSelectedAbility] = useState<string>("")

  return (
    <div className="flex flex-col justify-center items-center">
      {selectedPokemon && (
        <div className="flex flex-col items-center text-white">
          <img
            src={selectedPokemon.sprites.other.showdown.front_default}
            width={200}
            height={200}
          />
          <h2 className="text-2xl capitalize">{selectedPokemon.name}</h2>
          <p>#{selectedPokemon.nationalNumber}</p>
        </div>
      )}
    </div>
  )
}
