"use client"

import { FaPlusCircle } from "react-icons/fa"
import BuildTeam from "./BuildTeam"
import { useEffect, useState } from "react"
import { useSession } from "@/lib/auth-client"
import { fetchTeams } from "@/app/actions/teams"
import Link from "next/link"
import { Team } from "@/types/team"
import TeamDisplay from "./ViewTeamsComponents/TeamDisplay"

export default function ViewTeams() {
  const [isOpen, setIsOpen] = useState(false)
  const [userTeams, setUserTeams] = useState<Team[]>([])

  // Getting user session
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!session) return
    const loadTeams = async () => {
      const data = await fetchTeams()
      setUserTeams(data)
    }
    loadTeams()
  }, [session])

  return (
    <div className="flex flex-col justify-center items-center mt-10 gap-3">
      {!session && (
        <Link href={"/login"}>
          <h1 className="text-red-500 text-xl my-5">
            Login/Register To Start Building Teams!
          </h1>
        </Link>
      )}
      <button
        onClick={() => setIsOpen(true)}
        disabled={!session}
        className="py-2 px-2 bg-charmander-blue-500 disabled:bg-charmander-blue-500/50 text-xl text-white disabled:text-gray-400 flex flex-row items-center gap-2 rounded-md hover:scale-105 hover:bg-charmander-blue-400 transition-all"
      >
        <FaPlusCircle color={!session ? "gray" : "white"} />
        New Team
      </button>

      {userTeams.map((team) => (
        <TeamDisplay team={team} />
      ))}

      <BuildTeam isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}
