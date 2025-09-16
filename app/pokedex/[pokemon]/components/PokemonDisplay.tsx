import React, { useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { PokemonInfo } from "@/types/pokemonFull"
import { PokemonType } from "@/types/pokemonBasic"
import { typeColours, typeColoursHex } from "../../components/typeColours"

interface PokemonDisplayProps {
  loading: boolean
  pokemon: string
  pokemonInfo: PokemonInfo
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
    <div className="flex flex-row justify-center items-center">
      <div className="relative flex flex-col justify-center items-center bg-charmander-dull-200 w-200 h-160 rounded-xl mb-20">
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
          // const randomItem = list[Math.floor(Math.random() * list.length)] - Might implement for random flavour texts
          <div>
            <div className="flex flex-col items-center">
              <button
                className={`absolute top-3 right-3 py-1 px-6 ${
                  shiny ? "bg-amber-500" : "bg-charmander-blue-900"
                } text-white rounded-lg cursor-pointer multi-colour-glow-effect ${
                  shiny ? "glow-active" : ""
                } transition-all duration-300 shadow-md`}
                onClick={() => setShiny(!shiny)}
              >
                Shiny
              </button>
              <div className="flex flex-row gap-3 text-center text-5xl mt-5 mb-3">
                <h1 className=" text-white">
                  {pokemon
                    .split("-")
                    .map(
                      (pokemon) =>
                        pokemon.charAt(0).toUpperCase() + pokemon.slice(1)
                    )
                    .join("-")}
                </h1>
                <h1 className="text-white/50">
                  #{pokemonInfo?.id.toString().padStart(4, "0")}
                </h1>
              </div>
              <h2 className="text-white text-center tracking-wide text-lg text-wrap max-w-10/12">
                {pokemonInfo?.species.flavor_text_entries[0].flavor_text}
              </h2>
              <div className="flex flex-row gap-5 mt-3">
                {pokemonInfo?.types.map((type: PokemonType, index) => (
                  <h4
                    key={index}
                    className={`text-white text-2xl ${
                      typeColours[type.type.name as keyof typeof typeColours]
                    } rounded-lg px-3 shadow-md`}
                    style={{
                      filter: `drop-shadow(0 0 8px ${
                        typeColoursHex[
                          type.type.name as keyof typeof typeColoursHex
                        ]
                      })`,
                    }}
                  >
                    {`${type.type.name
                      .charAt(0)
                      .toUpperCase()}${type.type.name.slice(1)}`}
                  </h4>
                ))}
              </div>
              <Image
                className="relative -translate-x-15 mt-15"
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
            <div className="absolute bottom-2 right-2 px-2 max-h-[calc(70%-0.5rem)] overflow-y-scroll">
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
                      )
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
                      )
                  )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PokemonDisplay
