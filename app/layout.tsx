import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import localFont from "next/font/local"

export const metadata: Metadata = {
  title: "Poke Trainer",
  description: "Train your pokemon skills",
}

const pokeFont = localFont({
  src: [
    {
      path: "./fonts/Pokemon Classic.ttf",
    },
  ],
  variable: "--pokefont",
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={pokeFont.variable}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
