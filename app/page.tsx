"use client"
import Image from "next/image"
import { githubSignIn, googleSignIn } from "@/lib/auth-client"

export default function Home() {
  return (
    <div>
      <h1 className="text-white p-5">WELCOME TO POKE TRAINER!</h1>
      <button
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
      </button>
    </div>
  )
}
