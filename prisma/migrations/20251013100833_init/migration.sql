-- CreateTable
CREATE TABLE "public"."Pokemon" (
    "id" SERIAL NOT NULL,
    "nationalNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT,
    "height" TEXT,
    "weight" TEXT,
    "evYield" TEXT,
    "catchRate" TEXT,
    "baseFriendship" TEXT,
    "baseExp" TEXT,
    "growthRate" TEXT,
    "gender" TEXT,
    "eggCycles" TEXT,
    "hpMin" INTEGER,
    "hpMax" INTEGER,
    "attackMin" INTEGER,
    "attackMax" INTEGER,
    "defenseMin" INTEGER,
    "defenseMax" INTEGER,
    "spAtkMin" INTEGER,
    "spAtkMax" INTEGER,
    "spDefMin" INTEGER,
    "spDefMax" INTEGER,
    "speedMin" INTEGER,
    "speedMax" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PokemonType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PokemonType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PokemonAbility" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PokemonAbility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PokemonForm" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pokemonId" INTEGER NOT NULL,

    CONSTRAINT "PokemonForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EggGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EggGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TypeEffectiveness" (
    "id" SERIAL NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "attackType" TEXT NOT NULL,
    "multiplier" TEXT,

    CONSTRAINT "TypeEffectiveness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GameMove" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "moveId" INTEGER NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "level" TEXT,
    "tmNumber" TEXT,

    CONSTRAINT "GameMove_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Move" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "power" TEXT,
    "accuracy" TEXT,
    "pp" TEXT,
    "description" TEXT,
    "priority" TEXT,
    "effect" TEXT,
    "target" TEXT,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Game" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GameDescription" (
    "id" SERIAL NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "game" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "GameDescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PokemonTranslation" (
    "id" SERIAL NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "translatedName" TEXT NOT NULL,

    CONSTRAINT "PokemonTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_PokemonToPokemonType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PokemonToPokemonType_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_PokemonToPokemonAbility" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PokemonToPokemonAbility_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_EggGroupToPokemon" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EggGroupToPokemon_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Move_name_key" ON "public"."Move"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Game_name_key" ON "public"."Game"("name");

-- CreateIndex
CREATE INDEX "_PokemonToPokemonType_B_index" ON "public"."_PokemonToPokemonType"("B");

-- CreateIndex
CREATE INDEX "_PokemonToPokemonAbility_B_index" ON "public"."_PokemonToPokemonAbility"("B");

-- CreateIndex
CREATE INDEX "_EggGroupToPokemon_B_index" ON "public"."_EggGroupToPokemon"("B");

-- AddForeignKey
ALTER TABLE "public"."PokemonForm" ADD CONSTRAINT "PokemonForm_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "public"."Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TypeEffectiveness" ADD CONSTRAINT "TypeEffectiveness_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "public"."Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameMove" ADD CONSTRAINT "GameMove_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameMove" ADD CONSTRAINT "GameMove_moveId_fkey" FOREIGN KEY ("moveId") REFERENCES "public"."Move"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameMove" ADD CONSTRAINT "GameMove_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "public"."Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameDescription" ADD CONSTRAINT "GameDescription_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "public"."Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PokemonTranslation" ADD CONSTRAINT "PokemonTranslation_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "public"."Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PokemonToPokemonType" ADD CONSTRAINT "_PokemonToPokemonType_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PokemonToPokemonType" ADD CONSTRAINT "_PokemonToPokemonType_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."PokemonType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PokemonToPokemonAbility" ADD CONSTRAINT "_PokemonToPokemonAbility_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PokemonToPokemonAbility" ADD CONSTRAINT "_PokemonToPokemonAbility_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."PokemonAbility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EggGroupToPokemon" ADD CONSTRAINT "_EggGroupToPokemon_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."EggGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EggGroupToPokemon" ADD CONSTRAINT "_EggGroupToPokemon_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
