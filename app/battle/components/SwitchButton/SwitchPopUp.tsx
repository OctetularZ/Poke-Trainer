import { BattlePokemon } from "@/lib/battle"
import React, { useLayoutEffect, useRef, useState } from "react"
import { typeColoursHex } from "@/app/pokedex/components/typeColours"

interface SwitchPopUpProps {
  pokemon: BattlePokemon
}

const SwitchPopUp = ({ pokemon }: SwitchPopUpProps) => {
  const popupRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ left: 8, top: 8 })

  useLayoutEffect(() => {
    const updatePosition = () => {
      const popup = popupRef.current
      if (!popup) return

      const trigger = popup.parentElement
      if (!trigger) return

      const viewportPadding = 8
      const popupGap = 8

      const triggerRect = trigger.getBoundingClientRect()
      const popupRect = popup.getBoundingClientRect()

      const preferredLeft =
        triggerRect.left + triggerRect.width / 2 - popupRect.width / 2
      const left = Math.max(
        viewportPadding,
        Math.min(
          preferredLeft,
          window.innerWidth - popupRect.width - viewportPadding,
        ),
      )

      const top = Math.max(
        viewportPadding,
        triggerRect.top - popupRect.height - popupGap,
      )

      setPosition((prev) =>
        prev.left === left && prev.top === top ? prev : { left, top },
      )
    }

    const scheduleUpdate = () => {
      requestAnimationFrame(() => {
        updatePosition()
      })
    }

    const trigger = popupRef.current?.parentElement

    scheduleUpdate()
    window.addEventListener("resize", scheduleUpdate)
    window.addEventListener("scroll", scheduleUpdate, true)
    trigger?.addEventListener("mouseenter", scheduleUpdate)
    trigger?.addEventListener("focusin", scheduleUpdate)

    return () => {
      window.removeEventListener("resize", scheduleUpdate)
      window.removeEventListener("scroll", scheduleUpdate, true)
      trigger?.removeEventListener("mouseenter", scheduleUpdate)
      trigger?.removeEventListener("focusin", scheduleUpdate)
    }
  }, [pokemon.name])

  const hpPercent =
    pokemon.maxHp > 0
      ? Math.round(
          Math.max(0, Math.min(100, (pokemon.currentHp / pokemon.maxHp) * 100)),
        )
      : 0

  return (
    <div
      ref={popupRef}
      style={{ left: `${position.left}px`, top: `${position.top}px` }}
      className="pointer-events-none fixed z-30 w-90 max-w-[calc(100vw-1rem)] rounded-md border border-white/30 bg-gray-950/95 p-3 opacity-0 shadow-xl backdrop-blur-sm transition-all duration-150 group-hover:-translate-y-1 group-hover:opacity-100"
    >
      <div className="pb-2">
        <h3 className="mb-1 text-base font-bold leading-tight text-white wrap-break-word">
          {pokemon.name}
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          {pokemon.types.map((type) => {
            const typeColor =
              typeColoursHex[
                type.toLowerCase() as keyof typeof typeColoursHex
              ] ?? "#6b7280"

            return (
              <h1
                key={type}
                className="rounded px-1.5 text-sm font-semibold uppercase text-white text-shadow-black text-shadow-xs"
                style={{ backgroundColor: typeColor }}
              >
                {type}
              </h1>
            )
          })}
        </div>
      </div>

      <div className="mb-2 border-t border-white/20 pt-2 text-xs text-gray-200">
        <p>
          HP: {hpPercent}% ({pokemon.currentHp}/{pokemon.maxHp})
        </p>
        <p>Ability: Unknown</p>
      </div>

      <div className="mb-2 grid grid-cols-[max-content_auto_max-content_auto_max-content_auto_max-content_auto_max-content] items-center gap-x-1 gap-y-1 border-t border-white/20 pt-2 text-xs text-gray-200">
        <p>Atk: {pokemon.attack}</p>
        <span className="justify-self-center text-white/80">/</span>

        <p>Def: {pokemon.defense}</p>
        <span className="justify-self-center text-white/80">/</span>

        <p>SpA: {pokemon.specialAttack}</p>
        <span className="justify-self-center text-white/80">/</span>

        <p>SpD: {pokemon.specialDefense}</p>
        <span className="justify-self-center text-white/80">/</span>

        <p>Spe: {pokemon.speed}</p>
      </div>

      <div className="border-t border-white/20 pt-2">
        <p className="mb-1 text-xs font-semibold uppercase text-gray-100">
          Moves
        </p>
        <div className="flex flex-col text-xs text-gray-200">
          {pokemon.moves.map((move, index) => (
            <div key={move.id} className={index === 0 ? "pt-0" : "pt-1"}>
              <p className="leading-tight">- {move.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SwitchPopUp
