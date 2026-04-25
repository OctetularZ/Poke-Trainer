"use client"
import { motion, Variants } from "motion/react"
import Link from "next/link"
import React, { useState } from "react"
import { FaArrowRight } from "react-icons/fa6"

const Battle = () => {
  const [hovered, setHovered] = useState(false)

  const arrowVariants: Variants = {
    initial: { x: -40 },
    hover: { x: 0 },
  }

  return (
    <section id={"battle"} className="flex flex-col items-center">
      <div className="flex flex-row flex-wrap justify-center pb-20 gap-30 items-center pt-30">
        <div className="flex flex-col justify-center items-center border-2 border-charmander-blue-400 rounded-lg">
          <img
            className="w-auto h-125"
            src={"/home/battle-preview.png"}
            alt="Team Preview Image"
          />
        </div>
        <div className="flex flex-col justify-center items-center max-w-150">
          <h1 className="text-white text-5xl pb-5">Battle</h1>
          <h2 className="text-white/60 text-xl text-center text-highlight">
            <span className="text-white">
              Enter the arena and put your team to the test in 6v6 Pokémon
              battles against AI.
            </span>{" "}
            Predict switches, make the right calls, and outplay your opponent.
            Use your Pokémon's strengths to their maximum potential to control
            the battle and secure the win. Calculate and strategise or go all-in
            offense, the choice is yours. Every battle tells a different story.{" "}
            <mark>One decision can change everything</mark>. Choose wisely and
            fight for victory.
          </h2>
          <div className="flex flex-row gap-3 mt-10 justify-center items-center">
            <Link href={"/battle"}>
              <motion.button
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                whileHover={{
                  backgroundColor: "#29B6F6",
                  color: "white",
                  transition: { color: { delay: 0.1 } },
                }}
                className="py-2 px-5 rounded-md bg-white cursor-pointer text-lg"
              >
                Battle!
              </motion.button>
            </Link>
            <motion.div
              className="-z-5"
              variants={arrowVariants}
              initial="initial"
              animate={hovered ? "hover" : "initial"}
            >
              <FaArrowRight color="white" size={20} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Battle
