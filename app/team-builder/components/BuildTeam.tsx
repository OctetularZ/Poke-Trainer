import { motion, AnimatePresence } from "motion/react"
import PokemonList from "./PokemonList"

interface BuildTeamProps {
  isOpen: boolean
  onClose: () => void
}

export default function BuildTeam({ isOpen, onClose }: BuildTeamProps) {
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
            <div className="w-full relative flex flex-col justify-center items-start mt-10 mx-5 border-charmander-blue-400 border-2 rounded-xl p-6">
              <button
                onClick={onClose}
                className="absolute top-3 right-5 text-gray-400 hover:text-white hover:scale-105 text-4xl transition-all"
              >
                x
              </button>
              <PokemonList />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
