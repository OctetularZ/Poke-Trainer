"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { profileSchema } from "@/lib/validations/profile"
import Image from "next/image"
import { motion } from "motion/react"
import { updateProfile, getUserProfile } from "@/app/actions/profile"
import { z } from "zod"

const ProfileForm = () => {
  // Getting user session
  const { data: session, isPending } = useSession()

  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [success, setSuccess] = useState(false)
  const [profileData, setProfileData] = useState<{
    username: string | null
    name: string | null
    email: string | null
    coins: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user profile data on mount
  useEffect(() => {
    if (session?.user.id) {
      getUserProfile()
        .then((data) => {
          setProfileData(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err)
          setLoading(false)
        })
    }
  }, [session?.user.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setSuccess(false)

    const formData = new FormData(e.currentTarget)

    try {
      profileSchema.parse(Object.fromEntries(formData))
      await updateProfile(formData)
      setSuccess(true)

      // Refetch profile data to reflect changes
      const updatedData = await getUserProfile()
      setProfileData(updatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors)
      }
    }
  }

  return (
    <div className="flex flex-col items-center w-[90%] py-10 bg-charmander-blue-900 mt-10 rounded-2xl border-charmander-blue-200 border-2">
      {!session && (
        <h4 className="text-white text-4xl text-center">
          You must be logged in to edit your profile!
        </h4>
      )}
      {session && (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6 px-6"
        >
          <h2 className="text-white text-3xl font-bold text-center mb-8">
            Edit Profile
          </h2>

          {/* Loading State */}
          {loading && (
            <motion.div
              className="mt-5 flex items-center justify-center"
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
                width={100}
                height={100}
                alt="pixel-great-ball-loading"
              ></Image>
            </motion.div>
          )}

          {/* Coins Display */}
          {profileData && (
            <div className="flex flex-col items-center bg-charmander-blue-800 border-2 border-charmander-blue-200 text-white px-4 py-3 rounded-lg text-center">
              <div className="flex flex-row gap-1 items-center">
                <Image
                  src={"/spinning-coin-transparent.gif"}
                  width={30}
                  height={30}
                  alt="spinning-coin"
                ></Image>
                <h1 className="text-2xl">Coins: </h1>
              </div>
              <h4 className="text-3xl font-bold">{profileData.coins}</h4>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/20 border-2 border-green-500 text-green-200 px-4 py-3 rounded-lg text-center">
              Profile updated successfully!
            </div>
          )}

          {/* Username Field */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-white text-lg font-medium block"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              defaultValue={profileData?.username || ""}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-charmander-blue-800 text-white border-2 border-charmander-blue-200 focus:outline-none focus:border-charmander-blue-100 transition-colors disabled:opacity-50"
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="text-red-400 text-sm">{errors.username[0]}</p>
            )}
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-white text-lg font-medium block"
            >
              Display Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={profileData?.name || ""}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-charmander-blue-800 text-white border-2 border-charmander-blue-200 focus:outline-none focus:border-charmander-blue-100 transition-colors disabled:opacity-50"
              placeholder="Enter display name"
            />
            {errors.name && (
              <p className="text-red-400 text-sm">{errors.name[0]}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-charmander-blue-200 hover:bg-charmander-blue-100 text-charmander-blue-900 font-bold rounded-lg transition-colors duration-400 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  )
}

export default ProfileForm
