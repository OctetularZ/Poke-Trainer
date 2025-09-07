"use client"
import Link from "next/link"
import Image from "next/image"
import React from "react"
import { motion } from "motion/react"
import { githubSignIn, googleSignIn } from "@/lib/auth-client"
import { FaChevronDown } from "react-icons/fa"

const Hero = () => {
  return (
    <section className="flex flex-col items-center">
      <div
        id={"hero"}
        className="flex flex-row justify-center gap-20 items-center pt-30"
      >
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
            width={500}
            height={500}
            alt="Charizard Mega X"
          />
        </motion.div>
        <div className="max-w-150">
          <h1 className="text-7xl text-white text-center leading-20 pb-5">
            <span className="flex flex-wrap items-center justify-center">
              WELCOME TO
            </span>
            <span className="flex flex-wrap items-center justify-center">
              P
              <Image
                src="/pixel-great-ball.png"
                width={75}
                height={75}
                alt="Great Ball"
                className="inline-block -mx-2"
              />
              KE TRAINER!
            </span>
          </h1>
          <h2 className="text-white/70 text-center text-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Consequuntur alias placeat fugit, debitis excepturi doloribus
            laudantium unde cum libero. Quo, temporibus ipsa voluptates ratione
            distinctio dignissimos odio reprehenderit aperiam mollitia.
          </h2>
        </div>
        {/* <button
        className="text-white py-1 px-3 bg-red-500 cursor-pointer rounded"
        onClick={googleSignIn}
      >
        Google
      </button>
      <button
        className="text-white py-1 px-3 bg-amber-600 cursor-pointer rounded"
        onClick={githubSignIn}
      >
        Github
      </button> */}
      </div>
      <Link href={"#"}>
        <div className="flex flex-col gap-2 justify-center items-center">
          <h2 className="text-white text-xl pt-20">See More</h2>
          <FaChevronDown color="white" height={20} width={20} />
        </div>
      </Link>
    </section>
  )
}

export default Hero
