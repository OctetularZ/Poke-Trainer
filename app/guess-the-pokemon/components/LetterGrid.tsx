import React from "react"
import LetterBox from "./LetterBox"

interface LetterGridProps {
  clickedLetters: string[]
  onLetterClick: (letter: string) => void
  gameOver: boolean
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

const LetterGrid = ({
  clickedLetters,
  onLetterClick,
  gameOver,
}: LetterGridProps) => {
  return (
    <div className="flex flex-row flex-wrap justify-center items-center max-w-100 gap-2">
      {alphabet.map((letter) => (
        <LetterBox
          key={letter}
          letter={letter}
          isClicked={clickedLetters.includes(letter)}
          onClick={() => onLetterClick(letter)}
          disabled={gameOver}
        />
      ))}
    </div>
  )
}

export default LetterGrid
