"use client"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const Navbar = () => {
  return (
    <nav className="grid grid-cols-[1fr_auto_1fr] items-center justify-center justify-self-center mt-10 bg-charmander-dull-200 w-11/12 pl-5 pr-2 py-2 rounded-4xl text-white shadow-md drop-shadow-[0_0_10px_rgba(41,150,246,0.7)]">
      <ul className="flex gap-5 justify-self-start items-center text-2xl">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/pokedex">Pokédex</Link>
        </li>
        <li>
          <Link href="#">Guesser?</Link>
        </li>
        <li>
          <Link href="#">Team Builder</Link>
        </li>
      </ul>
      <Link href="/">
        <h1 className="flex items-center justify-center justify-self-center text-bold text-4xl">
          P
          <Image
            className="-mx-1"
            src={"/pixel-great-ball.png"}
            height={40}
            width={40}
            alt="Pixel Great Ball"
          ></Image>
          KÉ TRAINER
        </h1>
      </Link>
      <ul className="flex gap-5 justify-self-end items-center text-2xl">
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/register">
            <button className="py-2 px-5 bg-charmander-blue-400 rounded-4xl shadow-md drop-shadow-[0_0_10px_rgba(41,182,246,0.7)]">
              Register
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
