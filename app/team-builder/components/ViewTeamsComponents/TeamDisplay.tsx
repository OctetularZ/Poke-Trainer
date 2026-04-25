import { setActiveTeam } from "@/app/actions/teams"
import { Team } from "@/types/team"
import React from "react"

interface TeamDisplayProps {
  onClick: (teamId: number) => void
  team: Team
}

const TeamDisplay = ({ onClick, team }: TeamDisplayProps) => {
  return (
    <div className="flex flex-col items-start px-3 py-3 bg-charmander-blue-900 border-charmander-blue-500 border-2 rounded-lg">
      <div className="w-full flex flex-row items-center justify-between">
        <h1 className="text-white text-2xl">
          {team.name || `Untitled 0${team.id}`}
        </h1>
        <div className="flex flex-row gap-2">
          {!team.active ? (
            <button
              onClick={() => onClick(team.id)}
              className="bg-charmander-blue-500 py-1 px-3 text-white rounded-md hover:bg-charmander-blue-400 hover:scale-105 transition-all"
            >
              Set Active
            </button>
          ) : (
            <button
              disabled
              className="border-2 border-charmander-blue-500 py-1 px-3 text-white rounded-md"
            >
              Active
            </button>
          )}
          <button className="bg-charmander-blue-500 py-1 px-3 text-white rounded-md hover:bg-charmander-blue-400 hover:scale-105 transition-all">
            Edit
          </button>
        </div>
      </div>

      <div className="flex flex-row gap-3 items-center">
        {team.members.map((member) => (
          <button key={member.id} className="hover:scale-105 transition-all">
            <img
              src={member.pokemon.sprites.front_default || ""}
              className="w-25 h-25"
              alt={member.pokemon.name}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default TeamDisplay
