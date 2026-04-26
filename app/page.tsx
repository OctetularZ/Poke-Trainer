import Battle from "@/components/home/Battle"
import GuessThePokemon from "@/components/home/GuessThePokemon"
import Hero from "@/components/home/Hero"
import Pokedex from "@/components/home/Pokedex"
import TeamBuilder from "@/components/home/TeamBuilder"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Hero />
      <Pokedex />
      <GuessThePokemon />
      <TeamBuilder />
      <Battle />
      <div className="flex flex-col items-center gap-10 mt-50 mb-70">
        <h1 className="text-white text-center text-7xl max-sm:text-6xl text-wrap px-10">
          What are you waiting for?
        </h1>
        <Link href={"/register"}>
          <button className="py-2 px-5 rounded-md bg-white cursor-pointer text-lg hover:bg-charmander-blue-400 hover:text-white transition-all">
            Register Now
          </button>
        </Link>
      </div>
    </div>
  )
}
