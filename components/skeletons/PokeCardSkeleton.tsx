import Link from "next/link"
import Image from "next/image"
import React from "react"

const PokeCardSkeleton = () => {
  return (
    <Link href={"#"}>
      <div className="flex flex-col justify-center items-center w-55 bg-charmander-dull-200 rounded-2xl pt-10 pb-8 px-5">
        <div className="relative mb-5 w-[100px] h-[100px] items-center">
          <Image
            className="object-contain"
            src={"/placeholder.png"}
            fill
            alt="placeholder image"
            unoptimized={true}
          />
        </div>
        <p className="text-gray-400">#{"..."}</p>
        <h1 className="text-white text-2xl pb-3 text-wrap text-center">
          {"Loading..."}
        </h1>
        <div className="flex flex-row gap-5">
          <h4
            className={
              "text-white text-xl bg-[#282b30] rounded-lg px-3 shadow-md"
            }
            style={{
              filter: "drop-shadow(0 0 8px #1e2124)",
            }}
          >
            Type 1
          </h4>
          <h4
            className={
              "text-white text-xl bg-[#282b30] rounded-lg px-3 shadow-md"
            }
            style={{
              filter: "drop-shadow(0 0 8px #1e2124)",
            }}
          >
            Type 2
          </h4>
        </div>
      </div>
    </Link>
  )
}

export default PokeCardSkeleton
