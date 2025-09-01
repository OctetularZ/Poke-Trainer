"use client"
import React, { useEffect, useState } from "react"
import PokeCard from "./PokeCard"
import { PokemonBasic } from "../api/pokemon/route"
import Image from "next/image"
import { motion } from "motion/react"
import { typeColours } from "./typeColours"
import TypeFilter from "./TypeFilter"
import {
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react"
import { NextResponse } from "next/server"

interface Ability {
  name: string
  url: string
}

const fetchSize = 12
const types = Object.keys(typeColours)

const PokeGrid = () => {
  const [pokemon, setPokemon] = useState<PokemonBasic[]>([])
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [allLoaded, setAllLoaded] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedAbility, setSelectedAbility] = useState<string>("")
  const [abilities, setAbilities] = useState<Ability[]>([])

  const fetchPokemon = async (reset = false) => {
    setLoading(true)
    try {
      if (reset) setAllLoaded(false)

      const abilityQuery = selectedAbility
        ? `&abilities=${selectedAbility}`
        : ""

      const res = await fetch(
        `/api/pokemon?limit=${fetchSize}&offset=${reset ? 0 : offset}` +
          (selectedTypes.length > 0
            ? `&types=${selectedTypes.join(",")}`
            : "") +
          abilityQuery
      )
      const data: PokemonBasic[] = await res.json()

      if (data.length < fetchSize) setAllLoaded(true)
      setPokemon((prev) => (reset ? data : [...prev, ...data]))
      setOffset((prev) => (reset ? fetchSize : prev + fetchSize))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAbilities = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/ability/?limit=500")
    if (!res.ok)
      return NextResponse.json(
        { error: "Failed to fetch pokemon abilities! Please refresh" },
        { status: 500 }
      )
    const data = await res.json()

    return data.results
  }

  useEffect(() => {
    fetchPokemon(true)
  }, [selectedTypes, selectedAbility])

  useEffect(() => {
    const loadAbilities = async () => {
      const abilitiesData = await fetchAbilities()
      setAbilities(abilitiesData)
    }
    loadAbilities()
  }, [])

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
    setAllLoaded(false)
  }

  return (
    <div className="flex flex-col items-center">
      <TypeFilter
        types={types}
        selectedTypes={selectedTypes}
        toggleType={toggleType}
        typeColours={typeColours}
      />

      {/* Ability Selector */}
      <div className="flex flex-col items-center my-4 w-60">
        <h1 className="text-white mb-2">Ability:</h1>
        <Listbox value={selectedAbility} onChange={setSelectedAbility}>
          <div className="relative">
            <ListboxButton className="w-60 px-2 py-1 rounded border border-gray-300 bg-white text-left">
              {selectedAbility
                ? (() => {
                    const ability = abilities.find(
                      (a) => a.name === selectedAbility
                    )
                    return ability
                      ? ability.name.charAt(0).toUpperCase() +
                          ability.name.slice(1)
                      : selectedAbility
                  })()
                : "All"}
            </ListboxButton>
            <ListboxOptions className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
              <ListboxOption
                key=""
                value=""
                className={({ active, selected }) =>
                  `cursor-pointer select-none px-4 py-2 ${
                    active ? "bg-charmander-blue-100" : ""
                  } ${selected ? "font-bold" : ""}`
                }
              >
                All
              </ListboxOption>
              {abilities.map((ability) => (
                <ListboxOption
                  key={ability.name}
                  value={ability.name}
                  className={({ active, selected }) =>
                    `cursor-pointer select-none px-4 py-2 ${
                      active ? "bg-charmander-blue-100" : ""
                    } ${selected ? "font-bold" : ""}`
                  }
                >
                  {ability.name.charAt(0).toUpperCase() + ability.name.slice(1)}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      <div className="flex flex-row flex-wrap gap-10 pt-10 justify-center pb-10">
        {pokemon?.map((poke) => (
          <PokeCard
            key={poke.id}
            id={poke.id}
            name={`${poke.name.charAt(0).toUpperCase()}${poke.name.slice(1)}`}
            sprite={
              poke.showdown.front_default ||
              poke.showdown.front_default ||
              poke.sprites.front_default ||
              "/placeholder.png"
            }
            types={poke.types}
          />
        ))}
      </div>
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.3,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <Image
            src={"/pixel-great-ball.png"}
            width={50}
            height={50}
            alt="pixel-great-ball-loading"
          ></Image>
        </motion.div>
      ) : (
        !allLoaded && (
          <button
            onClick={() => fetchPokemon()}
            className="px-6 py-3 bg-charmander-blue-500 text-white font-semibold rounded-lg shadow-md drop-shadow-[0_0_10px_rgba(41,150,246,0.7)] cursor-pointer hover:bg-charmander-blue-300 transition-colors "
          >
            Load More
          </button>
        )
      )}
    </div>
  )
}

export default PokeGrid
