"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, Variants } from "motion/react"
import { FaArrowRight } from "react-icons/fa6"

const TeamBuilder = () => {
  const [hovered, setHovered] = useState(false)

  const arrowVariants: Variants = {
    initial: { x: -40 },
    hover: { x: 0 },
  }

  return (
    <section id={"team-builder"} className="flex flex-col items-center">
      <div className="flex flex-row flex-wrap justify-center pb-20 gap-20 items-center pt-30">
        <div className="flex flex-col justify-center items-center max-w-150">
          <h1 className="text-white text-5xl pb-5">Team Builder</h1>
          <h2 className="text-white/60 text-xl text-center text-highlight">
            <span className="text-white">Build your ultimate squad</span> with
            the Team Builder. Pick your favourite Pokémon or simply build the
            strongest possible teams. Choose from <mark>over 900+ Pokémon</mark>{" "}
            with unique abilities, moves, stats, and more. From balanced
            compositions to hyper offensive team comps to Gyarados Sweep comps,
            the possible combinations of Pokémon are limitless.{" "}
            <span className="text-white">
              The only limiting factor is your imagination.{" "}
            </span>
          </h2>
          <div className="flex flex-row gap-3 mt-10 justify-center items-center">
            <Link href={"/team-builder"}>
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
                Build a Team?
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
        <div className="flex flex-col justify-center items-center border-2 border-charmander-blue-400 rounded-lg">
          <img
            className="w-auto h-75"
            src={"/home/team-builder-preview.png"}
            alt="Team Preview Image"
          />
        </div>
      </div>
    </section>
  )
}

export default TeamBuilder
