"use client"
import Link from "next/link"
import React from "react"

const Navbar = () => {
  return (
    <nav className="grid grid-cols-[1fr_auto_1fr] items-center justify-center justify-self-center mt-10 bg-charmander-dull-200 w-11/12 pl-5 pr-2 py-2 rounded-4xl text-white">
      <ul className="flex gap-5 justify-self-start items-center text-2xl">
        <li>
          <Link href="#">Home</Link>
        </li>
        <li>
          <Link href="/pokedex">Pokedex</Link>
        </li>
        <li>
          <Link href="#">Guesser?</Link>
        </li>
        <li>
          <Link href="#">Team Builder</Link>
        </li>
      </ul>
      <a href="#">
        <h1 className="justify-self-center text-bold text-4xl">POKE TRAINER</h1>
      </a>
      <ul className="flex gap-5 justify-self-end items-center text-2xl">
        <li>
          <Link href="#">Login</Link>
        </li>
        <li>
          <Link href="#">
            <button className="py-2 px-5 bg-charmander-blue-400 rounded-4xl">
              Register
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
