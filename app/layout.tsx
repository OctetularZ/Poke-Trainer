import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import localFont from "next/font/local"

const minecraft = localFont({
  src: [
    {
      path: "./fonts/Minecraft 2.woff2",
      weight: "400",
    },
  ],
  variable: "--font-minecraft",
})

const pokemonClassic = localFont({
  src: [
    {
      path: "./fonts/PokemonClassic.woff2",
      weight: "400",
    },
  ],
  variable: "--font-pokemonClassic",
})

export const metadata: Metadata = {
  title: "Poké Trainer",
  description: "Train your pokemon skills",
  icons: {
    icon: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${minecraft.variable} ${pokemonClassic.variable}`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
