"use client"

import { BattlePokemon } from "@/lib/battle"
import Image from "next/image"
import React, { useEffect, useRef, useState } from "react"
import HealthBar from "./HealthBar"
import VerticalSpriteEffect from "./VerticalSpriteEffect"

interface StageProps {
  turnNumber: number
  attackerPokemon: BattlePokemon
  defenderPokemon: BattlePokemon
  attackEffect?: {
    type: string
    nonce: number
  } | null
}

const ATTACK_EFFECTS: Record<
  string,
  { src: string; frames: number; fps: number; scale: number }
> = {
  flying: {
    src: "/battling/attacks/flying.png",
    frames: 4,
    fps: 14,
    scale: 0.55,
  },
  poison: {
    src: "/battling/attacks/poison.png",
    frames: 4,
    fps: 12,
    scale: 4,
  },
}

type SwitchAnimPhase =
  | "idle"
  | "recall-shrink"
  | "recall-fly"
  | "throw-in"
  | "release-grow"

const SWITCH_TIMING_MS = {
  recallShrink: 250,
  recallFly: 300,
  throwIn: 300,
  releaseGrow: 250,
} as const

const RECALL_FLY_START_MS = SWITCH_TIMING_MS.recallShrink
const THROW_IN_START_MS = RECALL_FLY_START_MS + SWITCH_TIMING_MS.recallFly
const RELEASE_GROW_START_MS = THROW_IN_START_MS + SWITCH_TIMING_MS.throwIn
const IDLE_START_MS = RELEASE_GROW_START_MS + SWITCH_TIMING_MS.releaseGrow

function getBackSprite(pokemon: BattlePokemon) {
  return (
    pokemon.sprites?.other.showdown.back_default ||
    pokemon.sprites?.back_default ||
    "/battling/pokeball.png"
  )
}

function getFrontSprite(pokemon: BattlePokemon) {
  return (
    pokemon.sprites?.other.showdown.front_default ||
    pokemon.sprites?.front_default ||
    "/battling/pokeball.png"
  )
}

const Stage = ({
  turnNumber,
  attackerPokemon,
  defenderPokemon,
  attackEffect,
}: StageProps) => {
  const [attackerPhase, setAttackerPhase] = useState<SwitchAnimPhase>("idle")
  const [attackerDisplaySrc, setAttackerDisplaySrc] = useState<string>(
    getBackSprite(attackerPokemon),
  )
  const [defenderPhase, setDefenderPhase] = useState<SwitchAnimPhase>("idle")
  const [defenderDisplaySrc, setDefenderDisplaySrc] = useState<string>(
    getFrontSprite(defenderPokemon),
  )
  const previousAttackerId = useRef(attackerPokemon.id)
  const previousDefenderId = useRef(defenderPokemon.id)
  const attackerTimeoutsRef = useRef<number[]>([])
  const defenderTimeoutsRef = useRef<number[]>([])

  useEffect(() => {
    if (previousAttackerId.current === attackerPokemon.id) {
      return
    }

    previousAttackerId.current = attackerPokemon.id

    attackerTimeoutsRef.current.forEach((id) => window.clearTimeout(id))
    attackerTimeoutsRef.current = []

    setAttackerPhase("recall-shrink")

    const toRecallFly = window.setTimeout(() => {
      setAttackerDisplaySrc("/battling/pokeball.png")
      setAttackerPhase("recall-fly")
    }, RECALL_FLY_START_MS)

    const toThrowIn = window.setTimeout(() => {
      setAttackerPhase("throw-in")
    }, THROW_IN_START_MS)

    const toRelease = window.setTimeout(() => {
      setAttackerDisplaySrc(getBackSprite(attackerPokemon))
      setAttackerPhase("release-grow")
    }, RELEASE_GROW_START_MS)

    const toIdle = window.setTimeout(() => {
      setAttackerPhase("idle")
    }, IDLE_START_MS)

    attackerTimeoutsRef.current = [toRecallFly, toThrowIn, toRelease, toIdle]

    return () => {
      attackerTimeoutsRef.current.forEach((id) => window.clearTimeout(id))
      attackerTimeoutsRef.current = []
    }
  }, [attackerPokemon])

  useEffect(() => {
    if (previousDefenderId.current === defenderPokemon.id) {
      return
    }

    previousDefenderId.current = defenderPokemon.id

    defenderTimeoutsRef.current.forEach((id) => window.clearTimeout(id))
    defenderTimeoutsRef.current = []

    setDefenderPhase("recall-shrink")

    const toRecallFly = window.setTimeout(() => {
      setDefenderDisplaySrc("/battling/pokeball.png")
      setDefenderPhase("recall-fly")
    }, RECALL_FLY_START_MS)

    const toThrowIn = window.setTimeout(() => {
      setDefenderPhase("throw-in")
    }, THROW_IN_START_MS)

    const toRelease = window.setTimeout(() => {
      setDefenderDisplaySrc(getFrontSprite(defenderPokemon))
      setDefenderPhase("release-grow")
    }, RELEASE_GROW_START_MS)

    const toIdle = window.setTimeout(() => {
      setDefenderPhase("idle")
    }, IDLE_START_MS)

    defenderTimeoutsRef.current = [toRecallFly, toThrowIn, toRelease, toIdle]

    return () => {
      defenderTimeoutsRef.current.forEach((id) => window.clearTimeout(id))
      defenderTimeoutsRef.current = []
    }
  }, [defenderPokemon])

  const attackerAnimClass =
    attackerPhase === "recall-shrink"
      ? "battle-switch-recall-shrink"
      : attackerPhase === "recall-fly"
        ? "battle-switch-recall-fly"
        : attackerPhase === "throw-in"
          ? "battle-switch-throw-in"
          : attackerPhase === "release-grow"
            ? "battle-switch-release-grow"
            : ""

  const defenderAnimClass =
    defenderPhase === "recall-shrink"
      ? "battle-switch-top-recall-shrink"
      : defenderPhase === "recall-fly"
        ? "battle-switch-top-recall-fly"
        : defenderPhase === "throw-in"
          ? "battle-switch-top-throw-in"
          : defenderPhase === "release-grow"
            ? "battle-switch-top-release-grow"
            : ""

  const switchTimingStyle = {
    "--battle-switch-recall-shrink-ms": `${SWITCH_TIMING_MS.recallShrink}ms`,
    "--battle-switch-recall-fly-ms": `${SWITCH_TIMING_MS.recallFly}ms`,
    "--battle-switch-throw-in-ms": `${SWITCH_TIMING_MS.throwIn}ms`,
    "--battle-switch-release-grow-ms": `${SWITCH_TIMING_MS.releaseGrow}ms`,
  } as React.CSSProperties

  const attackSpriteConfig = attackEffect
    ? ATTACK_EFFECTS[attackEffect.type.toLowerCase()]
    : undefined

  return (
    <div className="relative flex w-full h-133 justify-center overflow-hidden border-1 border-amber-100">
      <Image
        src={"/stages/sand_mines.png"}
        className="object-contain"
        fill
        alt="sand-mines"
      />

      <div className="absolute bg-amber-50 border-3 border-black px-2 font-bold text-2xl rounded-md top-5 left-5">
        <h1>Turn {turnNumber}</h1>
      </div>

      {attackSpriteConfig && attackEffect ? (
        <div className="pointer-events-none absolute left-[42%] top-[48%] z-20 -translate-x-1/2 -translate-y-1/2">
          <VerticalSpriteEffect
            src={attackSpriteConfig.src}
            frames={attackSpriteConfig.frames}
            fps={attackSpriteConfig.fps}
            triggerKey={attackEffect.nonce}
            scale={attackSpriteConfig.scale}
          />
        </div>
      ) : null}

      <div className="flex flex-col items-center absolute bottom-20 left-20 z-10 gap-15">
        <HealthBar
          pokemonName={attackerPokemon.name}
          currentHP={attackerPokemon.currentHp}
          maxHP={attackerPokemon.maxHp}
        />
        <img
          className={`w-auto h-50 battle-switch-sprite ${attackerAnimClass}`}
          src={attackerDisplaySrc}
          alt={`${attackerPokemon.name} back sprite`}
          style={switchTimingStyle}
        />
      </div>

      <div className="flex flex-col items-center absolute top-8 right-12 z-10 gap-15">
        <HealthBar
          percentageOnLeft={true}
          pokemonName={defenderPokemon.name}
          currentHP={defenderPokemon.currentHp}
          maxHP={defenderPokemon.maxHp}
        />
        <img
          className={`w-auto h-30 battle-switch-sprite ${defenderAnimClass}`}
          src={defenderDisplaySrc}
          alt={`${defenderPokemon.name} front sprite`}
          style={switchTimingStyle}
        />
      </div>
    </div>
  )
}

export default Stage
