import React from "react"

interface LetterBoxProps {
  letter: string
  isClicked: boolean
  onClick: () => void
}

const LetterBox = ({ letter, isClicked, onClick }: LetterBoxProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isClicked}
      className={`transition-all duration-200 ${
        isClicked
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:scale-105"
      }`}
    >
      <div
        className={`flex flex-row justify-center items-center shadow-md py-5 px-4 rounded-sm transition-all duration-200 ${
          isClicked
            ? "bg-gray-800 text-gray-400"
            : "bg-gray-500 hover:bg-gray-700 text-white"
        }`}
      >
        <h1 className="text-xl">{letter}</h1>
      </div>
    </button>
  )
}

export default LetterBox
