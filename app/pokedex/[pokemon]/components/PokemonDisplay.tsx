import React, { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { Pokemon } from "@/types/pokemon"
import { PokemonType } from "@/types/type"
import { typeColoursHex } from "../../components/typeColours"
import PokeCard from "../../components/PokeCard"
import { FaChevronDown } from "react-icons/fa"

interface PokemonDisplayProps {
  loading: boolean
  pokemon: string
  pokemonInfo: Pokemon
  sprites: string[]
  shinySprites: string[]
}

const PokemonDisplay = ({
  loading,
  pokemon,
  pokemonInfo,
  sprites,
  shinySprites,
}: PokemonDisplayProps) => {
  const [shiny, setShiny] = useState(false)

  return (
    <div className="flex flex-row max-xl:flex-col max-xl:items-center xl:h-160 mb-20">
      <div className="relative flex flex-col justify-center items-center max-xl:pt-10 bg-charmander-dull-200 w-200 max-mlg:w-150 max-md:w-100 max-sm:w-75 h-full rounded-xl">
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 0.3,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <Image
              className="justify-self-center"
              src={"/placeholder.png"}
              width={100}
              height={100}
              alt="Placeholder"
            />
          </motion.div>
        ) : (
          <div>
            <div className="flex flex-col items-center">
              <button
                className={`absolute top-3 text-lg right-3 py-1 px-6 ${
                  shiny ? "bg-amber-500" : "bg-charmander-blue-900"
                } text-white rounded-lg cursor-pointer multi-colour-glow-effect ${
                  shiny ? "glow-active" : ""
                } transition-all duration-300 shadow-md`}
                onClick={() => setShiny(!shiny)}
              >
                Shiny
              </button>
              <div className="flex flex-row flex-wrap gap-3 max-w-9/12 justify-center text-center text-5xl mt-5 mb-3">
                <h1 className=" text-white">{pokemonInfo.name}</h1>
                <h1 className="text-white/50">
                  #{pokemonInfo?.nationalNumber.toString().padStart(4, "0")}
                </h1>
              </div>
              <div className="flex flex-row gap-5 mt-3">
                {pokemonInfo?.types.map((type: PokemonType, index) => (
                  <h4
                    key={index}
                    className={`text-white text-2xl rounded-lg px-3 shadow-md`}
                    style={{
                      backgroundColor:
                        typeColoursHex[
                          type.name.toLowerCase() as keyof typeof typeColoursHex
                        ],
                      filter: `drop-shadow(0 0 8px ${
                        typeColoursHex[
                          type.name.toLowerCase() as keyof typeof typeColoursHex
                        ]
                      })`,
                    }}
                  >
                    {`${type.name.charAt(0).toUpperCase()}${type.name.slice(
                      1,
                    )}`}
                  </h4>
                ))}
              </div>
              <Image
                className="relative md:-translate-x-15 mt-15 max-md:mt-5 max-xs:w-auto max-xs:h-70"
                src={
                  shiny
                    ? pokemonInfo?.sprites.other["official-artwork"]
                        .front_shiny!
                    : pokemonInfo?.sprites.other["official-artwork"]
                        .front_default!
                }
                width={350}
                height={350}
                alt={`${pokemon} Sprite`}
                unoptimized
              />
            </div>
            <div className="absolute bottom-2 right-2 px-2 max-h-[calc(70%-0.5rem)] overflow-y-scroll max-md:hidden">
              <h2 className="text-white text-center text-xl mb-2">Sprites :</h2>
              {shiny
                ? shinySprites?.map(
                    (shinySprite) =>
                      shinySprite && (
                        <div
                          key={shinySprite}
                          className="flex justify-center items-center bg-charmander-blue-900 w-35 h-40 mb-2 rounded-lg shadow-sm shadow-black"
                        >
                          <Image
                            src={shinySprite}
                            width={110}
                            height={110}
                            alt="Pokémon Sprite"
                            unoptimized
                          />
                        </div>
                      ),
                  )
                : sprites?.map(
                    (sprite) =>
                      sprite && (
                        <div
                          key={sprite}
                          className="flex justify-center items-center bg-charmander-blue-900 w-35 h-40 mb-2 rounded-lg shadow-sm shadow-black"
                        >
                          <Image
                            src={sprite}
                            width={110}
                            height={110}
                            alt="Pokémon Sprite"
                            unoptimized
                          />
                        </div>
                      ),
                  )}
            </div>
          </div>
        )}
      </div>
      {!loading && pokemonInfo.forms && (
        <div className="relative xl:ml-5 max-xl:mt-10 max-h-full">
          <div className="xl:absolute max-xl:relative max-xl:mb-5 xl:-top-10 xl:left-1/2 xl:-translate-x-1/2 flex flex-row gap-2 justify-center items-center">
            <h2 className="text-white text-xl text-center">Forms</h2>
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: 5 }}
              transition={{
                type: "spring",
                bounce: 1,
                stiffness: 30,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5,
              }}
            >
              <FaChevronDown color="white" />
            </motion.div>
          </div>
          <div className="flex flex-col max-xl:flex-row max-lg:flex-col gap-5 items-center max-h-full overflow-y-scroll max-xl:overflow-x-scroll max-lg:overflow-y-scroll max-xl:px-20 max-sm:px-5">
            {pokemonInfo.forms?.map((pokemon) => (
              <PokeCard
                key={pokemon.id}
                slug={pokemon.slug}
                nationalNumber={pokemon.nationalNumber}
                id={pokemon.id}
                name={pokemon.name}
                sprite={
                  pokemon.sprites.other.showdown.front_default ||
                  pokemon.sprites.front_default ||
                  "/placeholder.png"
                }
                types={pokemon.types}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PokemonDisplay
