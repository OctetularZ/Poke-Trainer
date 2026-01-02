/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `EggGroup` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pokemonId,game]` on the table `GameDescription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Pokemon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pokemonId,name]` on the table `PokemonForm` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pokemonId,language]` on the table `PokemonTranslation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pokemonId,attackType]` on the table `TypeEffectiveness` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Pokemon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pokemon" ADD COLUMN     "pokeapiId" INTEGER,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Evolution" (
    "id" SERIAL NOT NULL,
    "method" TEXT NOT NULL,
    "fromPokemonId" INTEGER NOT NULL,
    "toPokemonId" INTEGER NOT NULL,

    CONSTRAINT "Evolution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Evolution_fromPokemonId_toPokemonId_key" ON "Evolution"("fromPokemonId", "toPokemonId");

-- CreateIndex
CREATE UNIQUE INDEX "EggGroup_name_key" ON "EggGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GameDescription_pokemonId_game_key" ON "GameDescription"("pokemonId", "game");

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_slug_key" ON "Pokemon"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonForm_pokemonId_name_key" ON "PokemonForm"("pokemonId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonTranslation_pokemonId_language_key" ON "PokemonTranslation"("pokemonId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "TypeEffectiveness_pokemonId_attackType_key" ON "TypeEffectiveness"("pokemonId", "attackType");

-- AddForeignKey
ALTER TABLE "Evolution" ADD CONSTRAINT "Evolution_fromPokemonId_fkey" FOREIGN KEY ("fromPokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evolution" ADD CONSTRAINT "Evolution_toPokemonId_fkey" FOREIGN KEY ("toPokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
