import React from "react"
import Main from "./components/Main"

interface PokemonPageProps {
  params: Promise<{ pokemon: string }>
}

const page = async ({ params }: PokemonPageProps) => {
  const { pokemon } = await params

  return <Main pokemon={pokemon} />
}

export default page
