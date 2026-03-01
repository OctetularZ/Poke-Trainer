"use client"

import { PokemonAbility } from "@/types/ability"
import { Pokemon } from "@/types/pokemon"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect } from "react"
import { PokemonType } from "@/types/type"
import {
  typeColours,
  typeColoursHex,
} from "@/app/pokedex/components/typeColours"
import EVSlider from "./EVSlider"

interface PokemonStatSetterProps {
  selectedPokemon: Pokemon | null
}

interface EVStats {
  hp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
}

const MAX_TOTAL_EVS = 508
const MAX_STAT_EV = 252

export default function PokemonStatSetter({
  selectedPokemon,
}: PokemonStatSetterProps) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedAbility, setSelectedAbility] = useState<string>("")

  const [evs, setEvs] = useState<EVStats>({
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
  })

  const totalEVs =
    evs.hp +
    evs.attack +
    evs.defense +
    evs.specialAttack +
    evs.specialDefense +
    evs.speed

  const remainingEVs = MAX_TOTAL_EVS - totalEVs

  const handleEVChange = (stat: keyof EVStats, value: number) => {
    setEvs((prev) => ({
      ...prev,
      [stat]: value,
    }))
  }

  // Calculate actual stat values at level 100 with neutral nature
  const calculateStat = (base: number, ev: number, isHp: boolean = false) => {
    if (isHp) {
      return Math.floor(2 * base + ev / 4 + 110)
    }
    return Math.floor(2 * base + ev / 4 + 5)
  }

  return (
    <div className="flex flex-col justify-center items-center w-[600px] gap-6">
      {selectedPokemon && (
        <div className="flex flex-col items-center justify-center text-white">
          <img
            src={
              selectedPokemon.sprites.other.showdown.front_default ||
              selectedPokemon.sprites.front_default ||
              "/placeholder.png"
            }
            width={200}
            height={200}
          />
          <h2 className="text-2xl capitalize">{selectedPokemon.name}</h2>
          <h4 className="text-2xl">#{selectedPokemon.nationalNumber}</h4>
          <div className="flex flex-row gap-3 mt-2">
            {selectedPokemon.types.map((type: PokemonType, index) => (
              <h4
                key={index}
                className={`text-white text-xl ${
                  typeColours[
                    type.name.toLowerCase() as keyof typeof typeColours
                  ]
                } rounded-lg px-3 shadow-md`}
                style={{
                  filter: `drop-shadow(0 0 8px ${
                    typeColoursHex[
                      type.name.toLowerCase() as keyof typeof typeColoursHex
                    ]
                  })`,
                }}
              >
                {`${type.name.charAt(0).toUpperCase()}${type.name.slice(1)}`}
              </h4>
            ))}
          </div>
        </div>
      )}

      {selectedPokemon && (
        <div className="w-full bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-white">Stat Distribution</h1>
            <div className="text-white text-xl flex flex-row gap-2">
              <h4
                className={
                  remainingEVs === 0 ? "text-red-500" : "text-green-500"
                }
              >
                {totalEVs} / {MAX_TOTAL_EVS}
              </h4>
              <h4 className="text-gray-400">({remainingEVs} remaining)</h4>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <EVSlider
              statName="HP"
              value={evs.hp}
              onChange={(value) => handleEVChange("hp", value)}
              maxValue={MAX_STAT_EV}
              remainingEVs={remainingEVs}
              baseStat={selectedPokemon.stats?.hpBase || 0}
              calculatedStat={calculateStat(
                selectedPokemon.stats?.hpBase || 0,
                evs.hp,
                true,
              )}
            />
            <EVSlider
              statName="Attack"
              value={evs.attack}
              onChange={(value) => handleEVChange("attack", value)}
              maxValue={MAX_STAT_EV}
              remainingEVs={remainingEVs}
              baseStat={selectedPokemon.stats?.attackBase || 0}
              calculatedStat={calculateStat(
                selectedPokemon.stats?.attackBase || 0,
                evs.attack,
              )}
            />
            <EVSlider
              statName="Defense"
              value={evs.defense}
              onChange={(value) => handleEVChange("defense", value)}
              maxValue={MAX_STAT_EV}
              remainingEVs={remainingEVs}
              baseStat={selectedPokemon.stats?.defenseBase || 0}
              calculatedStat={calculateStat(
                selectedPokemon.stats?.defenseBase || 0,
                evs.defense,
              )}
            />
            <EVSlider
              statName="Sp. Attack"
              value={evs.specialAttack}
              onChange={(value) => handleEVChange("specialAttack", value)}
              maxValue={MAX_STAT_EV}
              remainingEVs={remainingEVs}
              baseStat={selectedPokemon.stats?.spAtkBase || 0}
              calculatedStat={calculateStat(
                selectedPokemon.stats?.spAtkBase || 0,
                evs.specialAttack,
              )}
            />
            <EVSlider
              statName="Sp. Defense"
              value={evs.specialDefense}
              onChange={(value) => handleEVChange("specialDefense", value)}
              maxValue={MAX_STAT_EV}
              remainingEVs={remainingEVs}
              baseStat={selectedPokemon.stats?.spDefBase || 0}
              calculatedStat={calculateStat(
                selectedPokemon.stats?.spDefBase || 0,
                evs.specialDefense,
              )}
            />
            <EVSlider
              statName="Speed"
              value={evs.speed}
              onChange={(value) => handleEVChange("speed", value)}
              maxValue={MAX_STAT_EV}
              remainingEVs={remainingEVs}
              baseStat={selectedPokemon.stats?.speedBase || 0}
              calculatedStat={calculateStat(
                selectedPokemon.stats?.speedBase || 0,
                evs.speed,
              )}
            />
          </div>
        </div>
      )}
    </div>
  )
}
