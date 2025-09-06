"use client"
import Image from "next/image"
import { githubSignIn, googleSignIn } from "@/lib/auth-client"

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center">
      <section
        key={"Hero"}
        className="flex flex-col justify-center items-center"
      >
        <h1 className="text-7xl text-white pt-20 flex items-center justify-center">
          WELCOME TO P
          <Image
            src={"/pixel-great-ball.png"}
            width={75}
            height={75}
            alt="Great Ball"
          />
          KE TRAINER!
        </h1>
        <Image
          className="pt-20"
          src={"/home/Mega-Charizard-X-Sprite.png"}
          width={500}
          height={500}
          alt="Charizard Mega X"
        />
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
      </section>
    </div>
  )
}
