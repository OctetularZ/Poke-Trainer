import React from "react"

interface GuessDisplayProps {
  pokemonName: string
  clickedLetters: string[]
}

const GuessDisplay = ({ pokemonName, clickedLetters }: GuessDisplayProps) => {
  const displayName = pokemonName
    .split("")
    .map((letter) =>
      clickedLetters.includes(letter.toUpperCase()) ? letter : "_",
    )
    .join(" ")

  return (
    <div>
      <h1 className="text-4xl text-white font-bold tracking-wider">
        {displayName}
      </h1>
    </div>
  )
}

export default GuessDisplay
