import Hero from "@/components/home/Hero"
import Pokedex from "@/components/home/Pokedex"

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Hero />
      <Pokedex />
    </div>
  )
}
