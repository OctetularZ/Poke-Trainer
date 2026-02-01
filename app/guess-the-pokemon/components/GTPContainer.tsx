"use client"
import React, { useState, useEffect } from "react"
import { Pokemon } from "@/types/pokemon"
import PokemonImage from "./PokemonImage"
import LetterGrid from "./LetterGrid"
import GuessDisplay from "./GuessDisplay"
import { PokemonType } from "@/types/type"
import {
  typeColours,
  typeColoursHex,
} from "@/app/pokedex/components/typeColours"

// interface GTPContainer {}

const GTPContainer = () => {
  const [loading, setLoading] = useState(true)
  const [pokemonInfo, setPokemonInfo] = useState<Pokemon>()
  const [sprites, setSprites] = useState<string[]>()
  const [shinySprites, setShinySprites] = useState<string[]>()
  const [error, setError] = useState<string | null>(null)

  // Guess the Pokemon states
  const [clickedLetters, setClickedLetters] = useState<string[]>([])
  const [points, setPoints] = useState(0)
  const [baseNameCompleted, setBaseNameCompleted] = useState(false)
  const [formNameCompleted, setFormNameCompleted] = useState(false)
  const [wrongGuesses, setWrongGuesses] = useState(0)

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

  // Parse baseName and formName safely
  const baseName = pokemonInfo?.name.split("(")[0].trim() || ""
  const formName =
    pokemonInfo?.name.split("(")[1]?.replace(")", "").trim() || ""

  // Checking for completed base name. 5 points if completed.
  useEffect(() => {
    if (!baseName || baseNameCompleted) return

    const baseNameLetters = baseName
      .toUpperCase()
      .split("")
      .filter((char) => /[A-Z]/.test(char))
    const allLettersGuessed = baseNameLetters.every((letter) =>
      clickedLetters.includes(letter),
    )

    if (allLettersGuessed) {
      setPoints((prev) => prev + 5)
      setBaseNameCompleted(true)
    }
  }, [clickedLetters, baseName, baseNameCompleted])

  // Checking for completed form name (if applicable). 5 points if completed.
  useEffect(() => {
    if (!formName || formNameCompleted) return

    const formNameLetters = formName
      .toUpperCase()
      .split("")
      .filter((char) => /[A-Z]/.test(char))
    const allLettersGuessed = formNameLetters.every((letter) =>
      clickedLetters.includes(letter),
    )

    if (allLettersGuessed) {
      setPoints((prev) => prev + 5)
      setFormNameCompleted(true)
    }
  }, [clickedLetters, formName, formNameCompleted])

  // Check for wrong letter guesses
  useEffect(() => {
    if (clickedLetters.length === 0 || !baseName) return

    const lastLetter = clickedLetters[clickedLetters.length - 1]
    const isInBaseName = baseName.toUpperCase().includes(lastLetter)
    const isInFormName = formName.toUpperCase().includes(lastLetter)

    // If letter is not in either name, add 1 to wrong guess counter
    if (!isInBaseName && !isInFormName) {
      setWrongGuesses((prev) => prev + 1)
    }
  }, [clickedLetters, baseName, formName])

  // Handle wrong guesses based on counter
  // useEffect(() => {
  //   if (wrongGuesses === 2) {
  //     console.log("2 wrong guesses - show first hint")
  //     // TODO: Show first hint
  //   } else if (wrongGuesses === 3) {
  //     console.log("3 wrong guesses - show second hint")
  //     // TODO: Show second hint
  //   } else if (wrongGuesses === 4) {
  //     console.log("4 wrong guesses - game over")
  //     // TODO: Game over logic
  //   } else if (wrongGuesses === 5) {
  //     console.log("5 wrong guesses - game over")
  //     // TODO: Game over logic
  //   }
  // }, [wrongGuesses])

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
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <h2 className="text-white text-3xl font-bold">Points: {points}</h2>
          <h2 className="text-red-400 text-3xl font-bold">
            Wrong: {wrongGuesses}/5
          </h2>
        </div>
        {wrongGuesses >= 2 && (
          <div className="flex flex-row gap-3 mb-4">
            <h1 className="text-white text-2xl">Hint 1:</h1>
            <div className="flex flex-row gap-5">
              {pokemonInfo?.types.map((type: PokemonType, index) => (
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
        {!loading && pokemonInfo && (
          <div className="flex flex-col items-center">
            <h1 className="text-white text-2xl">Name:</h1>
            <GuessDisplay
              pokemonName={baseName}
              clickedLetters={clickedLetters}
            />
            {formName && (
              <>
                <h1 className="text-white text-2xl">Form:</h1>
                <GuessDisplay
                  pokemonName={formName}
                  clickedLetters={clickedLetters}
                />
              </>
            )}
          </div>
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
