"use client"
import { signOut, useSession } from "@/lib/auth-client"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"

const Navbar = () => {
  // Getting user session
  const { data: session, isPending } = useSession()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const showAuthState = hasMounted && !isPending
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <nav className="z-100 relative flex flex-col justify-center justify-self-center items-center mt-10 bg-charmander-dull-200 w-11/12 px-3 py-2 rounded-4xl text-white shadow-md drop-shadow-[0_0_10px_rgba(41,150,246,0.7)]">
      <div className="flex w-full items-center justify-between">
        <button
          className="ml-2 text-2xl px-4 py-2 max-xs:px-2 max-xs:py-1 bg-charmander-blue-400 rounded-xl shadow-md focus:outline-none hover:bg-charmander-blue-300 transition-colors"
          onClick={() => setDropdownOpen((open) => !open)}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
        <Link
          href="/"
          className="hover:scale-105 transition-transform max-sm:mx-auto max-sm:justify-self-center"
        >
          <h1 className="flex items-center justify-center text-bold text-4xl max-xs:text-3xl">
            P
            <Image
              className="-mx-1 max-xs:w-8 max-xs:h-8"
              src={"/pixel-great-ball.png"}
              height={40}
              width={40}
              alt="Pixel Great Ball"
            ></Image>
            KÉ TRAINER
          </h1>
        </Link>
        {/* Desktop Auth Links */}
        <div className="max-sm:hidden flex gap-5 items-center text-2xl min-w-[220px] justify-end">
          {!showAuthState && <div className="min-h-[44px] min-w-[44px]" />}
          {showAuthState && !session && (
            <>
              <Link
                className="hover:text-charmander-blue-300 transition-colors"
                href="/login"
              >
                <h1>Login</h1>
              </Link>
              <Link href="/register">
                <button className="py-2 px-5 bg-charmander-blue-400 rounded-4xl shadow-md drop-shadow-[0_0_10px_rgba(41,182,246,0.7)] cursor-pointer hover:bg-charmander-blue-300 transition-colors">
                  Register
                </button>
              </Link>
            </>
          )}
          {showAuthState && session && (
            <>
              <Link
                className="underline underline-offset-5 hover:text-charmander-blue-300 transition-colors"
                href="/profile"
              >
                <h1>Profile</h1>
              </Link>
              <button
                onClick={signOut}
                className="py-2 px-5 bg-charmander-blue-400 rounded-4xl shadow-md drop-shadow-[0_0_10px_rgba(41,182,246,0.7)] cursor-pointer hover:bg-charmander-blue-300 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
      {/* Dropdown Menu (all screens, but auth links only on mobile) */}
      {dropdownOpen && (
        <div className="absolute top-full left-0 w-full bg-charmander-dull-200 rounded-4xl shadow-lg z-50 flex flex-col items-center py-4 animate-fade-in">
          <ul className="flex flex-col gap-3 items-center text-2xl w-full">
            <li className="hover:text-charmander-blue-300 transition-colors">
              <Link href="/" onClick={() => setDropdownOpen(false)}>
                Home
              </Link>
            </li>
            <li className="hover:text-charmander-blue-300 transition-colors">
              <Link href="/pokedex" onClick={() => setDropdownOpen(false)}>
                Pokédex
              </Link>
            </li>
            <li className="hover:text-charmander-blue-300 transition-colors">
              <Link
                href="/guess-the-pokemon"
                onClick={() => setDropdownOpen(false)}
              >
                Guess The Pokémon
              </Link>
            </li>
            <li className="hover:text-charmander-blue-300 transition-colors">
              <Link href="/team-builder" onClick={() => setDropdownOpen(false)}>
                Team Builder
              </Link>
            </li>
            <li className="hover:text-charmander-blue-300 transition-colors">
              <Link href="/battle" onClick={() => setDropdownOpen(false)}>
                Battle!
              </Link>
            </li>
          </ul>
          {/* Mobile Auth Links */}
          <div className="flex flex-col gap-3 items-center text-2xl w-full sm:hidden border-t-2 border-charmander-blue-400 mt-2">
            {!showAuthState && <div className="min-h-[44px] min-w-[44px]" />}
            {showAuthState && !session && (
              <>
                <Link
                  className="hover:text-charmander-blue-300 max-sm:mt-2 transition-colors"
                  href="/login"
                  onClick={() => setDropdownOpen(false)}
                >
                  <h1>Login</h1>
                </Link>
                <Link href="/register" onClick={() => setDropdownOpen(false)}>
                  <button className="py-2 px-5 bg-charmander-blue-400 rounded-4xl shadow-md drop-shadow-[0_0_10px_rgba(41,182,246,0.7)] cursor-pointer">
                    Register
                  </button>
                </Link>
              </>
            )}
            {showAuthState && session && (
              <>
                <Link
                  className="underline underline-offset-5 max-sm:mt-2 hover:text-charmander-blue-300 transition-colors"
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                >
                  <h1>Profile</h1>
                </Link>
                <button
                  onClick={() => {
                    setDropdownOpen(false)
                    signOut()
                  }}
                  className="py-2 px-5 bg-charmander-blue-400 rounded-4xl shadow-md drop-shadow-[0_0_10px_rgba(41,182,246,0.7)] cursor-pointer hover:bg-charmander-blue-300 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
