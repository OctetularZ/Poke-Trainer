import { PokemonForm } from "@/types/form"
import { getPokemonBasic } from "../pokemon";

export const fetchPokemonForms = async (pokemonForms: PokemonForm[]) => {
  try {
    const pokemonFormPromises = pokemonForms.map((form) => {
      return getPokemonBasic(form.name)
    });

    const pokemonFormsData = await Promise.all(pokemonFormPromises);
    const sortedPokemonFormsData = pokemonFormsData.sort((a, b) => a.id - b.id);
    return sortedPokemonFormsData;
  } catch (error) {
    console.error("Error fetching pokemon forms:", error);
  }
}