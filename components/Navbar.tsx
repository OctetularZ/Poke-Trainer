"use client"
import Link from "next/link"
import React from "react"

const Navbar = () => {
  return (
    <nav className="grid grid-cols-3 items-center justify-center justify-self-center mt-10 bg-red-300/50 w-10/12 pl-5 pr-2 py-2 rounded-4xl">
      <ul className="flex gap-5 justify-self-start items-center">
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
      <h1 className="justify-self-center">Poke Trainer</h1>
      <ul className="flex gap-5 justify-self-end items-center">
        <li>
          <Link href="#">Login</Link>
        </li>
        <li>
          <Link href="#">
            <button className="py-2 px-5 bg-amber-500 rounded-4xl">
              Register
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
