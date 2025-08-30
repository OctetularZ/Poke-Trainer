"use client"
import React from "react"
import { FaChevronCircleDown } from "react-icons/fa"

const Filter = () => {
  return (
    <div className="w-11/12 bg-red-500 py-5 flex flex-col items-center">
      <button className="cursor-pointer">
        <FaChevronCircleDown color="orange" size={25} />
      </button>
    </div>
  )
}

export default Filter
