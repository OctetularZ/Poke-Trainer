"use client"

import { PokemonAbility } from "@/types/ability"
import { Pokemon } from "@/types/pokemon"
import { useState, useEffect } from "react"
import { PokemonType } from "@/types/type"
import {
  typeColours,
  typeColoursHex,
} from "@/app/pokedex/components/typeColours"
import { natureEffects } from "./PokemonStatSetterComponents/NatureObj"
import EVSlider from "./PokemonStatSetterComponents/EVSlider"
import OptionBtn from "./PokemonStatSetterComponents/OptionBtn"

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

const natures = [
  "Hardy",
  "Lonely",
  "Brave",
  "Adamant",
  "Naughty",
  "Bold",
  "Docile",
  "Relaxed",
  "Impish",
  "Lax",
  "Timid",
  "Hasty",
  "Serious",
  "Jolly",
  "Naive",
  "Modest",
  "Mild",
  "Quiet",
  "Bashful",
  "Rash",
  "Calm",
  "Gentle",
  "Sassy",
  "Careful",
  "Quirky",
]

export default function PokemonStatSetter({
  selectedPokemon,
}: PokemonStatSetterProps) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedNature, setSelectedNature] = useState<string>("")
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

  // Helper to get nature modifier for a specific stat
  const getNatureModifier = (nature: string, stat: string): number => {
    if (!nature || !natureEffects[nature]) return 1.0

    const effect = natureEffects[nature]
    if (effect.increases === stat) return 1.1
    if (effect.decreases === stat) return 0.9
    return 1.0
  }

  // Calculate actual stat values (at level 100) with neutral nature
  const calculateStat = (
    base: number,
    ev: number,
    stat: string,
    isHp: boolean = false,
  ) => {
    const baseCalc = isHp ? 2 * base + ev / 4 + 110 : 2 * base + ev / 4 + 5

    const natureModifier = getNatureModifier(selectedNature, stat)
    return Math.floor(baseCalc * natureModifier)
  }

  return (
    <div className="flex flex-col items-center w-[600px] overflow-y-auto h-full gap-6">
      {selectedPokemon && (
        <>
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

          {/* Set Pokemon EVs Distribution */}
          <div className="w-full bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-white">
                Stat Distribution
              </h1>
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
                  "hp",
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
                  "attack",
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
                  "defense",
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
                  "specialAttack",
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
                  "specialDefense",
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
                  "speed",
                )}
              />
            </div>
          </div>

          {/* Select Nature for Pokemon */}
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-white text-xl">Select Nature:</h1>
            <div className="flex flex-row flex-wrap justify-center gap-3 max-w-[500px]">
              {natures.map((nature) => (
                <OptionBtn
                  key={nature}
                  optionName={nature}
                  isSelected={selectedNature === nature}
                  onClick={() => setSelectedNature(nature)}
                />
              ))}
            </div>
          </div>

          {/* Set Pokemon Ability */}
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-white text-xl">Select Ability:</h1>
            <div className="flex flex-row flex-wrap justify-center gap-3 max-w-[500px]">
              {selectedPokemon.abilities &&
                selectedPokemon.abilities.map((ability) => (
                  <OptionBtn
                    key={ability.name}
                    optionName={ability.name}
                    isSelected={selectedAbility === ability.name}
                    onClick={() => setSelectedAbility(ability.name)}
                  />
                ))}
            </div>
          </div>

          {/* Set Pokemon Moves */}
          <div className="w-full bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-white">Moves</h1>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
