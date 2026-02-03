import React from "react"
import Image from "next/image"
import { motion } from "motion/react"

interface SpriteImage {
  loading: boolean
  spriteImageUrl: string
  baseNameCompleted: boolean
  formNameCompleted: boolean
  gameOver: boolean
}

const PokemonImage = ({
  loading,
  spriteImageUrl,
  baseNameCompleted,
  formNameCompleted,
  gameOver,
}: SpriteImage) => {
  // Reveal image when: both names completed (win) OR game is over (loss at 5 wrong letter guessed)
  const shouldReveal = (baseNameCompleted && formNameCompleted) || gameOver

  return (
    <div className="w-200 h-150 flex items-center justify-center border-2 border-amber-100 rounded-xl bg-gray-800">
      {loading ? (
        <motion.div
          className="mt-5"
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
            width={100}
            height={100}
            alt="pixel-great-ball-loading"
          ></Image>
        </motion.div>
      ) : (
        <img
          className={`${shouldReveal ? "" : "brightness-0"}  object-contain w-[50%] h-[50%] my-10 transition-all duration-500 ease-in-out`}
          src={spriteImageUrl}
        ></img>
      )}
    </div>
  )
}

export default PokemonImage
