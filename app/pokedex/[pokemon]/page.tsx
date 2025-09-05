import React from "react"
import Test from "./Test"

interface PokemonPageProps {
  params: Promise<{ pokemon: string }>
}

const page = async ({ params }: PokemonPageProps) => {
  const { pokemon } = await params

  return <Test pokemon={pokemon} /> // Change
}

export default page
