-- DropForeignKey
ALTER TABLE "Evolution" DROP CONSTRAINT "Evolution_fromPokemonId_fkey";

-- DropForeignKey
ALTER TABLE "Evolution" DROP CONSTRAINT "Evolution_toPokemonId_fkey";

-- DropForeignKey
ALTER TABLE "GameDescription" DROP CONSTRAINT "GameDescription_pokemonId_fkey";

-- DropForeignKey
ALTER TABLE "GameMove" DROP CONSTRAINT "GameMove_pokemonId_fkey";

-- DropForeignKey
ALTER TABLE "PokemonForm" DROP CONSTRAINT "PokemonForm_pokemonId_fkey";

-- DropForeignKey
ALTER TABLE "PokemonTranslation" DROP CONSTRAINT "PokemonTranslation_pokemonId_fkey";

-- DropForeignKey
ALTER TABLE "TypeEffectiveness" DROP CONSTRAINT "TypeEffectiveness_pokemonId_fkey";

-- AddForeignKey
ALTER TABLE "Evolution" ADD CONSTRAINT "Evolution_fromPokemonId_fkey" FOREIGN KEY ("fromPokemonId") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evolution" ADD CONSTRAINT "Evolution_toPokemonId_fkey" FOREIGN KEY ("toPokemonId") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonForm" ADD CONSTRAINT "PokemonForm_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeEffectiveness" ADD CONSTRAINT "TypeEffectiveness_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMove" ADD CONSTRAINT "GameMove_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameDescription" ADD CONSTRAINT "GameDescription_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonTranslation" ADD CONSTRAINT "PokemonTranslation_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
