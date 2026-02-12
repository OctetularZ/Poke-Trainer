"use client"

import { FaPlusCircle } from "react-icons/fa"
import BuildTeam from "./BuildTeam"
import { useState } from "react"

export default function ViewTeams() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <button
        onClick={() => setIsOpen(true)}
        className="py-2 px-2 bg-charmander-blue-500 text-xl text-white flex flex-row items-center gap-2 rounded-md hover:scale-105 hover:bg-charmander-blue-400 transition-all"
      >
        <FaPlusCircle color="white" />
        New Team
      </button>

      <BuildTeam isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}
