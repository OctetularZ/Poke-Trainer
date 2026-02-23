"use client"

import { PokemonAbility } from "@/types/ability"
import { Pokemon } from "@/types/pokemon"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect } from "react"
import { typeColoursHex } from "@/app/pokedex/components/typeColours"
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"

const fetchSize = 50
const types = Object.keys(typeColoursHex)

// Column definitions for TanStack Table
const columns: ColumnDef<Pokemon>[] = [
  {
    accessorKey: "sprites",
    header: "Sprite",
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
    header: "#",
    cell: ({ getValue }) => (
      <span className="capitalize text-xl">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue }) => (
      <span className="capitalize text-xl">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "types",
    header: "Types",
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
    header: "Abilities",
    cell: ({ row }) => (
      <span className="capitalize text-xl">
        {row.original.abilities?.map((a) => a.name).join(", ")}
      </span>
    ),
  },
]

export default function PokemonList() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allLoaded, setAllLoaded] = useState(false)
  const [offset, setOffset] = useState(0)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedAbility, setSelectedAbility] = useState<string>("")
  const [abilities, setAbilities] = useState<PokemonAbility[]>([])

  const [showFilters, setShowFilters] = useState(false)

  // Create table instance
  const table = useReactTable({
    data: pokemon,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const fetchAllPokemon = async (reset = false) => {
    setLoading(true)
    try {
      if (reset) setAllLoaded(false)

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
    <div className="flex flex-col justify-center items-center">
      {loading && (
        <motion.div
          className="mt-5"
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
          ></Image>
        </motion.div>
      )}

      <div className="w-full max-h-[400px] overflow-y-auto">
        <table className="w-full text-white border-collapse">
          <thead className="sticky top-0 bg-gray-900 z-10 text-xl">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-700">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left">
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
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-800 hover:bg-gray-800/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
