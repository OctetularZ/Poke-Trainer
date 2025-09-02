"use client"

import React from "react"

interface TypeFilterProps {
  types: string[]
  selectedTypes: string[]
  toggleType: (type: string) => void
  typeColours: Record<string, string>
}

const TypeFilter = ({
  types,
  selectedTypes,
  toggleType,
  typeColours,
}: TypeFilterProps) => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-lg text-white">Type:</h1>
      <div className="flex flex-wrap gap-2 my-5 justify-center w-10/12">
        {types.map((type) => {
          const isSelected = selectedTypes.includes(type)

          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-3 py-1 rounded-md cursor-pointer font-semibold text-white ${
                isSelected
                  ? `${typeColours[type as keyof typeof typeColours]}`
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TypeFilter
