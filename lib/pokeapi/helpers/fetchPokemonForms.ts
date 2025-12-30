import { PokemonForm } from "@/types/form"
import { getPokemonBasic } from "../pokemon"

export const fetchPokemonForms = async (pokemonForms: PokemonForm[]) => {
    try {
      const pokemonFormPromises = pokemonForms.map((form) =>
        getPokemonBasic(form.pokemon.name)
      )

      const pokemonFormsData = await Promise.all(pokemonFormPromises)
      return pokemonFormsData
    } catch (error) {
      console.error("Error fetching pokemon forms:", error)
    }
  }