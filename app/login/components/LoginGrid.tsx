"use client"
import React from "react"
import Image from "next/image"
import { googleSignIn, githubSignIn } from "@/lib/auth-client"
import { FcGoogle } from "react-icons/fc"
import { FaApple, FaGithub } from "react-icons/fa"

const LoginGrid = () => {
  return (
    <div className="flex flex-row justify-self-center gap-20 justify-center rounded-lg w-200 h-100 bg-charmander-dull-200 border-2 border-charmander-blue-400">
      <div className="flex flex-col justify-center items-center w-[50%]">
        <Image
          className="-mr-25"
          src={"/home/Mega-Charizard-X-Sprite.png"}
          width={400}
          height={300}
          alt="Mega Charizard"
        />
      </div>
      <div className="flex flex-col justify-center gap-5 items-center w-[50%] bg-charmander-blue-400 rounded-r-sm">
        <h1 className="text-white text-center text-4xl">Login</h1>
        <div className="flex flex-col justify-center items-center gap-2 w-full">
          <button
            className="text-black py-2 w-[80%] flex flex-row justify-center items-center gap-1 bg-white cursor-pointer rounded"
            onClick={googleSignIn}
          >
            <FaApple size={20} />
            <h1 className="text-lg">Apple</h1>
          </button>
          <button
            className="text-black py-2 w-[80%] flex flex-row justify-center items-center gap-1 bg-white cursor-pointer rounded"
            onClick={googleSignIn}
          >
            <FcGoogle size={20} />
            <h1 className="text-lg">Google</h1>
          </button>
          <button
            className="text-white py-2 w-[80%] flex flex-row justify-center items-center gap-2 bg-black cursor-pointer rounded"
            onClick={githubSignIn}
          >
            <FaGithub size={20} />
            <h1 className="text-lg">Github</h1>
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginGrid
