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
import PopUp from "./PopUp"

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
  const [hintGiven, setHintGiven] = useState(false) // Track if hint was given at 3 wrong

  // PopUp states
  const [showCorrectPopup, setShowCorrectPopup] = useState(false)
  const [showIncorrectPopup, setShowIncorrectPopup] = useState(false)

  // Check if game is over (win or lose)
  const gameOver = (baseNameCompleted && formNameCompleted) || wrongGuesses >= 5

  const handleLetterClick = (letter: string) => {
    if (gameOver) return // Prevent letter clicks when game is over.
    setClickedLetters((prev) => [...prev, letter])
  }

  // Reset game
  const resetGame = () => {
    // Reset all game states
    setClickedLetters([])
    setPoints(0)
    setBaseNameCompleted(false)
    setFormNameCompleted(false)
    setWrongGuesses(0)
    setHintGiven(false)
    setShowCorrectPopup(false)
    setShowIncorrectPopup(false)

    // Fetch new pokemon
    setLoading(true)
    fetchPokemonInfo()
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

  // Set formNameCompleted to true if there's no form name
  useEffect(() => {
    if (!formName && pokemonInfo) {
      setFormNameCompleted(true)
    }
  }, [formName, pokemonInfo])

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

  // Add missing letter hint at 3 wrong guesses
  useEffect(() => {
    if (wrongGuesses !== 4 || hintGiven || !baseName) return

    // Get all unique letters from pokemon name (both base and form)
    const allNameLetters = (baseName + formName)
      .toUpperCase()
      .split("")
      .filter((char) => /[A-Z]/.test(char))

    // Find letters that haven't been clicked yet
    const missingLetters = [...new Set(allNameLetters)].filter(
      (letter) => !clickedLetters.includes(letter),
    )

    if (missingLetters.length > 0) {
      // Pick a random missing letter
      const randomIndex = Math.floor(Math.random() * missingLetters.length)
      const hintLetter = missingLetters[randomIndex]

      setClickedLetters((prev) => [...prev, hintLetter])
      setHintGiven(true)
    }
  }, [wrongGuesses, hintGiven, baseName, formName, clickedLetters])

  // For when the user guesses the pokemon correctly
  useEffect(() => {
    if (baseNameCompleted && formNameCompleted) {
      setShowCorrectPopup(true)
    }
  }, [baseNameCompleted, formNameCompleted])

  // For when the user guesses the pokemon incorrect (5 wrong guesses (letters pressed))
  useEffect(() => {
    if (wrongGuesses === 5) {
      setShowIncorrectPopup(true)
    }
  }, [wrongGuesses])

  return (
    <div className="flex w-full h-full flex-row justify-center items-center mt-20 mb-20 gap-10">
      <PokemonImage
        loading={loading}
        spriteImageUrl={
          pokemonInfo?.sprites.other.showdown.front_default ||
          pokemonInfo?.sprites.front_default ||
          "/placeholder.png"
        }
        baseNameCompleted={baseNameCompleted}
        formNameCompleted={formNameCompleted}
      />
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-row gap-2 items-center">
            <h2 className="text-white text-3xl font-bold">Points: </h2>
            <h4 className="text-white text-4xl font-bold">{points}</h4>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <h2 className="text-red-400 text-3xl font-bold">Wrong: </h2>
            <h4 className="text-red-400 text-4xl font-bold">
              {wrongGuesses}/5
            </h4>
          </div>
        </div>

        {/* 1st hint - Type */}
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

        {/* 2nd Hint - Game Description */}
        {wrongGuesses >= 3 && (
          <div className="flex flex-row gap-3 mb-4">
            <h1 className="text-white text-2xl">Hint 2:</h1>
            <h2 className="text-white text-2xl max-w-75 line-clamp-2">
              {pokemonInfo?.gameDescriptions?.[0].description &&
              pokemonInfo.gameDescriptions.length > 0
                ? pokemonInfo.gameDescriptions[0].description
                : ""}
            </h2>
          </div>
        )}

        {/* 3rd Hint - Random letter revealed */}
        {wrongGuesses >= 4 && (
          <div className="flex flex-row gap-3 mb-4">
            <h1 className="text-white text-2xl">
              Hint 3: Random Letter Revealed!
            </h1>
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
          gameOver={gameOver}
        />
        <button
          onClick={() => {
            resetGame()
          }}
          className="text-white my-10 bg-charmander-blue-500 px-6 py-3 rounded-lg hover:bg-charmander-blue-400 hover:scale-105 transition-all"
        >
          Play Again
        </button>
      </div>

      {/* Pop up for correct answer */}
      <PopUp
        isOpen={showCorrectPopup}
        onClose={() => setShowCorrectPopup(false)}
        title="🎉 Correct!"
        borderColour="border-charmander-blue-500"
      >
        <h4 className="text-3xl mb-4">
          {baseName} {formName} is correct!
        </h4>
        <h4 className="text-3xl mb-4">Points: {points}</h4>
        <button
          onClick={() => {
            resetGame()
          }}
          className="bg-charmander-blue-500 px-6 py-3 rounded-lg hover:bg-charmander-blue-400 hover:scale-105 transition-all"
        >
          Play Again
        </button>
      </PopUp>

      {/* Pop up for incorrect answer */}
      <PopUp
        isOpen={showIncorrectPopup}
        onClose={() => setShowIncorrectPopup(false)}
        title="😭 Nice Try!"
        borderColour="border-red-500"
      >
        <h4 className="text-3xl mb-4">
          The correct answer is {baseName} {formName}!
        </h4>
        <h4 className="text-3xl mb-4">Points: {points}</h4>
        <button
          onClick={() => {
            resetGame()
          }}
          className="bg-red-600 px-6 py-3 rounded-lg hover:bg-red-500 hover:scale-105 transition-all"
        >
          Play Again
        </button>
      </PopUp>
    </div>
  )
}

export default GTPContainer
