import prisma from "../../lib/prisma.js";
import { getPokemonDetails } from '../../scraping/pokemonData.js'

let pokemonData = getPokemonDetails();