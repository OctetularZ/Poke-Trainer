import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"
import { Pokemon } from "@/types/pokemon"
import PokemonList from "./PokemonStatSetterComponents/PokemonList"
import PokemonStatSetter from "./PokemonStatSetter"
import { FaSquareCheck } from "react-icons/fa6"
import { PokemonBuild } from "@/types/team"
import { saveTeam } from "@/app/actions/teams"

interface BuildTeamProps {
  isOpen: boolean
  onClose: () => void
}

export default function BuildTeam({ isOpen, onClose }: BuildTeamProps) {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [pokemonLoading, setPokemonLoading] = useState(false)
  const [team, setTeam] = useState<PokemonBuild[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [teamName, setTeamName] = useState("")

  const handleAddToTeam = (build: PokemonBuild) => {
    if (editingIndex !== null) {
      setTeam((prev) => prev.map((b, i) => (i === editingIndex ? build : b)))
      setEditingIndex(null)
    } else {
      setTeam((prev) => [...prev, build])
    }
  }
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="w-full h-[700px] relative flex flex-col justify-center items-start mt-10 mx-5 border-charmander-blue-400 border-2 rounded-xl p-6">
              <button
                onClick={onClose}
                className="absolute top-3 right-5 text-gray-400 hover:text-white hover:scale-105 text-4xl transition-all"
              >
                x
              </button>
              <div className="h-full flex flex-row gap-5 items-center justify-center">
                <div className="h-full flex flex-col items-center gap-1">
                  {team.length > 0 && (
                    <div className="flex flex-col items-start mb-5">
                      <div className="flex flex-row items-center">
                        <h4 className="text-white text-2xl mr-3">
                          Current Team:
                        </h4>
                        {team.map((build, index) => (
                          <div
                            key={build.pokemon.id}
                            className="relative group"
                          >
                            <img
                              src={build.pokemon.sprites.front_default}
                              width={50}
                              height={50}
                              className="cursor-pointer hover:opacity-70 transition-opacity"
                              onClick={() => {
                                setEditingIndex(index)
                                setSelectedPokemon(build.pokemon)
                              }}
                            />
                            <button
                              onClick={() => {
                                setTeam((prev) =>
                                  prev.filter((_, i) => i !== index),
                                )
                                if (editingIndex === index)
                                  setEditingIndex(null)
                              }}
                              className="absolute -top-1 -right-1 hidden group-hover:flex bg-red-600 hover:bg-red-400 text-white rounded-sm w-4 h-4 text-xs items-center justify-center leading-none"
                            >
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                      {team.length >= 6 && (
                        <div className="flex flex-row items-center gap-3">
                          <h4 className="text-white text-2xl">Confirm Team?</h4>
                          <input
                            value={teamName}
                            onChange={(event) =>
                              setTeamName(event.target.value)
                            }
                            placeholder="Team name?"
                            className="bg-black/40 text-white px-3 py-1 rounded-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-charmander-blue-400"
                          />
                          <button
                            onClick={() => {
                              saveTeam(team, teamName)
                              onClose()
                              setTeam([])
                              setTeamName("")
                            }}
                          >
                            <FaSquareCheck
                              size={25}
                              className="text-green-500 hover:text-green-300 transition-all"
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-h-0">
                    <PokemonList
                      onSelectPokemon={(pokemon) => {
                        setEditingIndex(null)
                        setSelectedPokemon(pokemon)
                      }}
                      onLoadingChange={setPokemonLoading}
                      excludedIds={team
                        .filter((_, i) => i !== editingIndex)
                        .map((b) => b.pokemon.id)}
                    />
                  </div>
                </div>
                <PokemonStatSetter
                  key={
                    editingIndex !== null
                      ? `edit-${editingIndex}`
                      : `new-${selectedPokemon?.id ?? "none"}`
                  }
                  selectedPokemon={selectedPokemon}
                  isLoading={pokemonLoading}
                  initialBuild={
                    editingIndex !== null ? team[editingIndex] : undefined
                  }
                  isEditing={editingIndex !== null}
                  teamFull={team.length >= 6}
                  onAddToTeam={handleAddToTeam}
                  onClearSelectedPokemon={() => setSelectedPokemon(null)}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
