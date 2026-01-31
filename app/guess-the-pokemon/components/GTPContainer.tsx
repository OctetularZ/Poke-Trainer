"use client"
import React, { useState, useEffect } from "react"
import { Pokemon } from "@/types/pokemon"
import PokemonImage from "./PokemonImage"
import LetterGrid from "./LetterGrid"
import GuessDisplay from "./GuessDisplay"

// interface GTPContainer {}

const GTPContainer = () => {
  const [loading, setLoading] = useState(true)
  const [pokemonInfo, setPokemonInfo] = useState<Pokemon>()
  const [sprites, setSprites] = useState<string[]>()
  const [shinySprites, setShinySprites] = useState<string[]>()
  const [error, setError] = useState<string | null>(null)

  // Guess the Pokemon states
  const [clickedLetters, setClickedLetters] = useState<string[]>([])

  const handleLetterClick = (letter: string) => {
    setClickedLetters((prev) => [...prev, letter])
  }

  const fetchPokemonInfo = async () => {
    try {
      const res = await fetch(`/api/randomPokemon`)
      if (!res.ok) {
        console.error("Could not fetch random Pokémon")
        setError("Could not fetch random Pokémon")
        setLoading(false)
        return
      }
      const data = await res.json()
      setPokemonInfo(data)
      setSprites([
        data?.sprites.other.showdown.front_default ||
          data?.sprites.front_default,
        data?.sprites.other.showdown.back_default || data?.sprites.back_default,
      ])
      setShinySprites([
        data?.sprites.other.showdown.front_shiny || data?.sprites.front_shiny,
        data?.sprites.other.showdown.back_shiny || data?.sprites.back_shiny,
      ])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPokemonInfo()
  }, [])

  return (
    <div className="flex w-full h-full flex-row justify-center items-center mt-20 mb-20 gap-10">
      <PokemonImage
        loading={loading}
        spriteImageUrl={
          pokemonInfo?.sprites.other.showdown.front_default ||
          pokemonInfo?.sprites.front_default ||
          "/placeholder.png"
        }
      />
      <div className="flex flex-col">
        {!loading && pokemonInfo && (
          <GuessDisplay
            pokemonName={pokemonInfo!.name}
            clickedLetters={clickedLetters}
          />
        )}
        <LetterGrid
          clickedLetters={clickedLetters}
          onLetterClick={handleLetterClick}
        />
      </div>
    </div>
  )
}

export default GTPContainer
