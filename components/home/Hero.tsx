"use client"
import Link from "next/link"
import Image from "next/image"
import React from "react"
import { motion } from "motion/react"
import { FaChevronDown } from "react-icons/fa"

const Hero = () => {
  return (
    <section id={"hero"} className="flex flex-col items-center">
      <div className="flex flex-row flex-wrap justify-center gap-20 items-center pt-30 max-sm:pt-0 px-5">
        <motion.div initial={{ y: -750 }} animate={{ y: 0 }}>
          <motion.div
            animate={{ y: 50 }}
            transition={{
              type: "spring",
              bounce: 1,
              stiffness: 30,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1,
            }}
          >
            <Image
              src={"/home/Mega-Charizard-X-Sprite.png"}
              className="max-sm:hidden"
              width={500}
              height={500}
              alt="Charizard Mega X"
            />
          </motion.div>
        </motion.div>
        <div className="max-w-150">
          <h1 className="text-7xl max-sm:text-6xl text-white text-center leading-20 pb-5">
            <span className="flex flex-wrap items-center justify-center">
              WELCOME TO
            </span>
            <span>
              P
              <Image
                src="/pixel-great-ball.png"
                width={75}
                height={75}
                alt="Great Ball"
                className="inline-block -mx-2"
              />
              KÉ
            </span>{" "}
            <span className="flex flex-wrap items-center justify-center">
              TRAINER!
            </span>
          </h1>
          <h2 className="text-white/90 text-center text-xl px-5">
            A free, accessible platform where you can craft strong Pokémon
            teams, save them, engage in strategic battles with them, search a
            Pokédex for any Pokémon you desire, and more. All in one web-based
            platform. Accessible anywhere, anytime, for free!
          </h2>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-15 justify-center items-center">
        <Link href={"#pokedex"}>
          <motion.button
            whileHover={{
              backgroundColor: "#29B6F6",
              color: "white",
              transition: { color: { delay: 0.1 } },
            }}
            className="py-2 px-5 rounded-md bg-white cursor-pointer text-lg"
          >
            Learn More
          </motion.button>
        </Link>
        <motion.div
          animate={{ y: 10 }}
          transition={{
            type: "spring",
            bounce: 1,
            stiffness: 30,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        >
          <FaChevronDown color="white" />
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
