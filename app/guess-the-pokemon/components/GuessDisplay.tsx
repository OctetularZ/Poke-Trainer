import React from "react"

interface GuessDisplayProps {
  pokemonName: string
  clickedLetters: string[]
}

const GuessDisplay = ({ pokemonName, clickedLetters }: GuessDisplayProps) => {
  const displayName = pokemonName
    .split("")
    .map((letter) =>
      /[^a-zA-Z]/.test(letter) // Show special symbols and spaces but not letters
        ? letter
        : clickedLetters.includes(letter.toUpperCase())
          ? letter
          : "—",
    )
    .join(" ")

  return (
    <div className="max-w-100 mb-10">
      <h1 className="text-4xl text-white text-center font-bold tracking-wider">
        {displayName}
      </h1>
    </div>
  )
}

export default GuessDisplay
