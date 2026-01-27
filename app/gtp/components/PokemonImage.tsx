import React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"

interface SpriteImage {
  loading: boolean
  spriteImageUrl: string
}

const PokemonImage = ({ loading, spriteImageUrl }: SpriteImage) => {
  return (
    <div className="w-[50%] h-[50%] flex items-center justify-center">
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
          className="brightness-0 w-[50%] h-[50%]"
          src={spriteImageUrl}
        ></img>
      )}
    </div>
  )
}

export default PokemonImage
