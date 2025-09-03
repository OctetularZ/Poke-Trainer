"use client"
import Image from "next/image"
import { googleSignIn } from "@/lib/auth-client"

export default function Home() {
  return (
    <div>
      <h1 className="text-white p-5">WELCOME TO POKE TRAINER!</h1>
      <button
        className="text-white py-1 px-3 bg-charmander-blue-400 cursor-pointer rounded"
        onClick={googleSignIn}
      >
        Google
      </button>
    </div>
  )
}
