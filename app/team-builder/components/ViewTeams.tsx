"use client"

import { FaPlusCircle } from "react-icons/fa"
import BuildTeam from "./BuildTeam"
import { useEffect, useState } from "react"
import { useSession } from "@/lib/auth-client"
import { deleteTeam, fetchTeams, setActiveTeam } from "@/app/actions/teams"
import Link from "next/link"
import { Team } from "@/types/team"
import TeamDisplay from "./ViewTeamsComponents/TeamDisplay"
import { motion } from "motion/react"
import Image from "next/image"

export default function ViewTeams() {
  const [isOpen, setIsOpen] = useState(false)
  const [userTeams, setUserTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>("")

  const handleSetActive = async (teamId: number) => {
    setUserTeams((userTeams) =>
      userTeams.map((team) =>
        team.id === teamId
          ? { ...team, active: true }
          : { ...team, active: false },
      ),
    )
    await setActiveTeam(teamId)
  }

  const handleTeamDelete = async (teamId: number) => {
    await deleteTeam(teamId)
    const updatedTeams = await fetchTeams()
    setUserTeams(updatedTeams)
  }

  const refreshTeams = async () => {
    setIsOpen(false)
    const updatedTeams = await fetchTeams()
    setUserTeams(updatedTeams)
  }

  // Getting user session
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (isPending) return
    if (!session) setError("You must be logged in to create and save teams!")
    else {
      const loadTeams = async () => {
        const data = await fetchTeams()
        setUserTeams(data)
      }
      loadTeams()
      setLoading(false)
    }
  }, [session])

  if (error) {
    return (
      <div className="items-center flex flex-col flex-wrap mt-10">
        <h1 className="text-center text-wrap text-red-500 text-2xl">{error}</h1>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center mt-10 gap-5 mb-20">
      {!session && !loading && (
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

      {loading && (
        <div className="flex justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 0.3,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <Image
              src={"/pixel-great-ball.png"}
              width={50}
              height={50}
              alt="pixel-great-ball-loading"
            />
          </motion.div>
        </div>
      )}

      {!loading &&
        userTeams.map((team) => (
          <TeamDisplay
            key={team.id}
            onSetAcive={handleSetActive}
            onDelete={handleTeamDelete}
            team={team}
          />
        ))}

      <BuildTeam isOpen={isOpen} onClose={refreshTeams} />
    </div>
  )
}
