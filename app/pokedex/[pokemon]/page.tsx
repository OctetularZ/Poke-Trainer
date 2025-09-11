import React from "react"
import Main from "./components/Main"

interface PokemonPageProps {
  params: Promise<{ pokemon: string }>
}

const page = async ({ params }: PokemonPageProps) => {
  const { pokemon } = await params

  return (
    <div className="flex flex-col justify-center items-center">
      <Main pokemon={pokemon} />
    </div>
  )
}

export default page
