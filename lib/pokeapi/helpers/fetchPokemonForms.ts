import prisma from "@/lib/prisma";
import { PokemonForm } from "@/types/form"

export const fetchPokemonForms = async (pokemonForms: PokemonForm[]) => {
    try {
      const pokemonFormPromises = pokemonForms.map((form) => {
        const words = form.name.split(/\s+/).filter(Boolean);
        return prisma.pokemon.findMany({
          where: {
            AND: words.map(word => ({
              name: { contains: word, mode: "insensitive" }
            }))
          }
        });
      });

      const pokemonFormsData = await Promise.all(pokemonFormPromises);
      console.log(pokemonFormsData);
      return pokemonFormsData;
    } catch (error) {
      console.error("Error fetching pokemon forms:", error);
    }
  }