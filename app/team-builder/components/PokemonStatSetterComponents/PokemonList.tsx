import { PokemonAbility } from "@/types/ability"
import { Pokemon } from "@/types/pokemon"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect, useMemo } from "react"
import { typeColoursHex } from "@/app/pokedex/components/typeColours"
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"
import PokemonSearchFilter from "./PokemonSearchFilter"
import AbilitySearchFilter from "./AbilitySearchFilter"
import { namesAndSlugs } from "@/app/pokedex/components/SearchFilter"

const fetchSize = 30
const types = Object.keys(typeColoursHex)

interface PokemonListProps {
  onSelectPokemon?: (pokemon: Pokemon) => void
  onLoadingChange?: (loading: boolean) => void
  excludedIds?: number[]
}

export default function PokemonList({
  onSelectPokemon,
  onLoadingChange,
  excludedIds = [],
}: PokemonListProps) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allLoaded, setAllLoaded] = useState(false)
  const [offset, setOffset] = useState(0)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedAbility, setSelectedAbility] = useState<string>("")
  const [abilities, setAbilities] = useState<PokemonAbility[]>([])
  const [pokemonNames, setPokemonNames] = useState<namesAndSlugs[]>([])
  const [selectedName, setSelectedName] = useState<namesAndSlugs | null>(null)

  const [nameFilter, setNameFilter] = useState("")
  const [nameFilterOpen, setNameFilterOpen] = useState(false)
  const [typeFilterOpen, setTypeFilterOpen] = useState(false)
  const [abilityFilterOpen, setAbilityFilterOpen] = useState(false)

  const fetchNames = async () => {
    try {
      const res = await fetch("/api/names")
      if (!res.ok) {
        setError("Failed to fetch pokemon names! Please refresh")
        return
      }
      const names = await res.json()
      return names
    } catch (error) {
      console.error("Error fetching names:", error)
      setError("Failed to fetch pokemon names! Please refresh")
      return
    }
  }

  useEffect(() => {
    const loadNames = async () => {
      const pokemonNames = await fetchNames()
      if (pokemonNames) {
        setPokemonNames(pokemonNames)
      }
    }
    loadNames()
  }, [])

  const fetchAbilities = async () => {
    try {
      const res = await fetch("/api/abilities")
      if (!res.ok) {
        setError("Failed to fetch pokemon abilities! Please refresh")
        return
      }
      const abilities = await res.json()
      return abilities
    } catch (error) {
      console.error("Error fetching abilities:", error)
      setError("Failed to fetch pokemon abilities! Please refresh")
      return
    }
  }

  useEffect(() => {
    const loadAbilities = async () => {
      const abilitiesData = await fetchAbilities()
      if (abilitiesData) {
        setAbilities(abilitiesData)
      }
    }
    loadAbilities()
  }, [])

  useEffect(() => {
    if (!selectedName) return

    const fetchPokemon = async () => {
      onLoadingChange?.(true)
      const res = await fetch(`/api/pokemon/${selectedName.slug}`)

      if (!res.ok) {
        console.error("Couldn't fetch showcase pokemon!")
        setError("Couldn't fetch showcase pokemon!")
        onLoadingChange?.(false)
        return
      }

      const data: Pokemon = await res.json()

      onSelectPokemon?.(data)
      onLoadingChange?.(false)
      setLoading(false)
    }
    fetchPokemon()
  }, [selectedName])

  const columns = useMemo<ColumnDef<Pokemon>[]>(
    () => [
      {
        accessorKey: "sprites",
        header: () => <div className="px-4 py-3">Sprite</div>,
        cell: ({ row }) => (
          <img
            src={row.original.sprites.front_default}
            alt={row.original.name}
            width={60}
            height={60}
          />
        ),
      },
      {
        accessorKey: "nationalNumber",
        header: () => <div className="px-4 py-3">#</div>,
        cell: ({ getValue }) => (
          <span className="capitalize text-xl">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "name",
        header: () => (
          <div
            className="px-4 py-3 flex flex-col gap-1 hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => setNameFilterOpen((prev) => !prev)}
          >
            <h4>Name</h4>
            <div
              className={nameFilterOpen ? "" : "hidden"}
              onClick={(e) => e.stopPropagation()}
            >
              <PokemonSearchFilter
                allPokemon={pokemonNames}
                value={selectedName?.name ?? ""}
                onSelect={(pokemon) => setSelectedName(pokemon)}
              />
            </div>
          </div>
        ),
        cell: ({ getValue }) => (
          <span className="capitalize text-xl">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "types",
        header: () => (
          <div
            className="relative px-4 py-3 hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => setTypeFilterOpen((prev) => !prev)}
          >
            <h4>Types</h4>
            <div
              className={`absolute top-full left-0 z-20 flex flex-col overflow-y-auto overscroll-y-none gap-1 w-full max-h-[200px] bg-gray-900 border border-gray-600 rounded-b p-2 ${typeFilterOpen ? "" : "hidden"}`}
              onClick={(e) => e.stopPropagation()}
            >
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className="px-2 py-0.5 rounded text-sm capitalize transition-opacity"
                  style={{
                    backgroundColor:
                      typeColoursHex[type as keyof typeof typeColoursHex],
                    opacity: selectedTypes.includes(type) ? 1 : 0.4,
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex gap-1">
            {row.original.types?.map((type) => (
              <span
                key={type.name}
                className="px-2 py-1 rounded text-lg capitalize"
                style={{
                  backgroundColor:
                    typeColoursHex[
                      type.name.toLowerCase() as keyof typeof typeColoursHex
                    ],
                }}
              >
                {type.name}
              </span>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "abilities",
        header: () => (
          <div
            className="px-4 py-3 flex flex-col gap-1 hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => setAbilityFilterOpen((prev) => !prev)}
          >
            <h4>Abilities</h4>
            <div
              className={abilityFilterOpen ? "" : "hidden"}
              onClick={(e) => e.stopPropagation()}
            >
              <AbilitySearchFilter
                allAbilities={abilities}
                value={selectedAbility}
                onSelect={(ability) => setSelectedAbility(ability.name)}
              />
            </div>
          </div>
        ),
        cell: ({ row }) => (
          <span className="capitalize text-xl">
            {row.original.abilities?.map((a) => a.name).join(", ")}
          </span>
        ),
      },
    ],
    [
      nameFilter,
      nameFilterOpen,
      typeFilterOpen,
      abilityFilterOpen,
      selectedTypes,
      abilities,
    ],
  )

  const filteredPokemon = useMemo(
    () => pokemon.filter((p) => !excludedIds.includes(p.id)),
    [pokemon, excludedIds],
  )

  // Create table instance
  const table = useReactTable({
    data: filteredPokemon,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const fetchAllPokemon = async (reset = false) => {
    if (reset) {
      setLoading(true)
      setAllLoaded(false)
    } else {
      setLoadingMore(true)
    }
    try {
      const abilityQuery = selectedAbility
        ? `&abilities=${selectedAbility}`
        : ""

      const res = await fetch(
        `/api/listOfAllPokemon?limit=${fetchSize}&offset=${reset ? 0 : offset}` +
          (selectedTypes.length > 0
            ? `&types=${selectedTypes.join(",")}`
            : "") +
          abilityQuery,
      )

      if (!res.ok) {
        console.error("Could not fetch Pokemon")
        setError("Could not fetch Pokémon")
        return
      }
      const data: Pokemon[] = await res.json()

      if (data.length < fetchSize) setAllLoaded(true)
      setPokemon((prev) => (reset ? data : [...prev, ...data]))
      setOffset((prev) => (reset ? fetchSize : prev + fetchSize))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchAllPokemon(true)
  }, [selectedTypes, selectedAbility])

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
    setAllLoaded(false)
  }

  return (
    <div className="flex flex-col justify-center items-center w-[700px] h-full">
      <div className="min-w-[650px] min-h-[400px] h-full overflow-y-auto mx-5">
        <table className="w-full text-white border-collapse">
          <thead className="sticky top-0 bg-gray-900 z-10 text-xl">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-700">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-10">
                  <div className="flex justify-center">
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
                        src={"/pixel-great-ball.png"}
                        width={50}
                        height={50}
                        alt="pixel-great-ball-loading"
                      />
                    </motion.div>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => {
                    onSelectPokemon?.(row.original)
                  }}
                  className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!loading && !allLoaded && (
          <div className="flex justify-center py-4">
            {loadingMore ? (
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
                  src="/pixel-great-ball.png"
                  width={50}
                  height={50}
                  alt="pixel-great-ball-loading"
                />
              </motion.div>
            ) : (
              <button
                onClick={() => fetchAllPokemon()}
                className="px-6 py-2 bg-charmander-blue-500 text-white rounded-md shadow-md drop-shadow-[0_0_10px_rgba(41,150,246,0.7)] cursor-pointer hover:bg-charmander-blue-300 transition-colors"
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
