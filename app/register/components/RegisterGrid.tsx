"use client"
import React from "react"
import Image from "next/image"
import { googleSignIn, githubSignIn, discordSignIn } from "@/lib/auth-client"
import { FcGoogle } from "react-icons/fc"
import { FaDiscord, FaGithub } from "react-icons/fa"
import Link from "next/link"

const RegisterGrid = () => {
  return (
    <div className="relative justify-self-center animate-glow-orange w-200 h-100 rounded-lg">
      <div className="flex flex-row justify-self-center gap-20 justify-center rounded-lg w-200 h-100 bg-charmander-dull-200">
        <div className="flex flex-col justify-center gap-3 items-center w-[50%] bg-[#ee8329] rounded-l-lg">
          <h1 className="text-white text-center text-4xl mb-5">Register</h1>
          <div className="flex flex-col justify-center items-center gap-2 w-full">
            <button
              className="text-black py-2 w-[80%] flex flex-row justify-center items-center gap-1 bg-white cursor-pointer rounded transition transform duration-300 hover:scale-105 hover:brightness-110"
              onClick={googleSignIn}
            >
              <FcGoogle size={20} />
              <h1 className="text-lg">Google</h1>
            </button>
            <button
              className="text-white py-2 w-[80%] flex flex-row justify-center items-center gap-1 bg-[#5661f9] cursor-pointer rounded transition transform duration-300 hover:scale-105 hover:brightness-110"
              onClick={discordSignIn}
            >
              <FaDiscord size={20} color="white" />
              <h1 className="text-lg">Discord</h1>
            </button>
            <button
              className="text-white py-2 w-[80%] flex flex-row justify-center items-center gap-2 bg-black cursor-pointer rounded transition transform duration-300 hover:scale-105 hover:brightness-110"
              onClick={githubSignIn}
            >
              <FaGithub size={20} />
              <h1 className="text-lg">Github</h1>
            </button>
          </div>
          <h2 className="text-white">
            Already have an account?{" "}
            <Link href={"/login"}>
              <span className="text-charmander-dull-200 transition duration-300 inline-block hover:scale-105">
                Sign In
              </span>
            </Link>
          </h2>
        </div>
        <div className="flex flex-col justify-center items-center w-[50%]">
          <Image
            className="mr-15"
            src={"/Charizard-Sprite.webp"}
            width={300}
            height={200}
            alt="Charizard Sprite"
          />
        </div>
      </div>
    </div>
  )
}

export default RegisterGrid
