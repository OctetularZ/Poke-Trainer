"use client"

import React, { useEffect, useMemo, useState } from "react"

interface VerticalSpriteEffectProps {
  src: string
  frames: number
  fps?: number
  triggerKey: number
  className?: string
  scale?: number
  onComplete?: () => void
}

const VerticalSpriteEffect = ({
  src,
  frames,
  fps = 12,
  triggerKey,
  className,
  scale = 1,
  onComplete,
}: VerticalSpriteEffectProps) => {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [naturalSize, setNaturalSize] = useState<{
    width: number
    height: number
  } | null>(null)

  useEffect(() => {
    if (!src) return

    const image = new window.Image()
    image.src = src
    image.onload = () => {
      setNaturalSize({ width: image.naturalWidth, height: image.naturalHeight })
    }
  }, [src])

  useEffect(() => {
    if (!triggerKey || triggerKey < 1 || frames < 1) {
      return
    }

    setCurrentFrame(0)
    setIsPlaying(true)

    let frame = 0
    const frameDuration = Math.max(16, Math.round(1000 / fps))

    const intervalId = window.setInterval(() => {
      frame += 1

      if (frame >= frames) {
        window.clearInterval(intervalId)
        setIsPlaying(false)
        onComplete?.()
        return
      }

      setCurrentFrame(frame)
    }, frameDuration)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [triggerKey, frames, fps, onComplete])

  const frameSize = useMemo(() => {
    if (!naturalSize || frames < 1) return null

    const sourceFrameHeight = Math.floor(naturalSize.height / frames)

    return {
      width: Math.max(1, Math.round(naturalSize.width * scale)),
      height: Math.max(1, Math.round(sourceFrameHeight * scale)),
    }
  }, [naturalSize, frames, scale])

  if (!isPlaying || !frameSize) {
    return null
  }

  return (
    <div
      className={className}
      style={{
        width: frameSize.width,
        height: frameSize.height,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <img
        src={src}
        alt=""
        style={{
          width: frameSize.width,
          height: frameSize.height * frames,
          maxWidth: "none",
          transform: `translateY(-${currentFrame * frameSize.height}px)`,
          imageRendering: "pixelated",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </div>
  )
}

export default VerticalSpriteEffect
