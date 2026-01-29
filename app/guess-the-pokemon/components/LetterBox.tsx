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
      className="hover: cursor-pointer"
    >
      <div className="flex flex-row justify-center items-center shadow-md py-5 px-4 bg-gray-500 hover:bg-gray-700 rounded-sm transition-all duration-100">
        <h1 className="text-white text-xl">{letter}</h1>
      </div>
    </button>
  )
}

export default LetterBox
