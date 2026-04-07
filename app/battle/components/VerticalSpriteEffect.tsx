"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"

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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [naturalSize, setNaturalSize] = useState<{
    width: number
    height: number
  } | null>(null)
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
    null,
  )
  const [detectedFrames, setDetectedFrames] = useState<
    Array<{ y: number; height: number }>
  >([])
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const safeConfiguredFrames = useMemo(() => {
    if (!Number.isFinite(frames) || frames < 1) {
      return 1
    }

    return Math.floor(frames)
  }, [frames])

  const totalFrames = useMemo(() => {
    if (detectedFrames.length > 0) {
      return detectedFrames.length
    }

    return safeConfiguredFrames
  }, [detectedFrames, safeConfiguredFrames])

  const safeFps = useMemo(() => {
    if (!Number.isFinite(fps) || fps <= 0) {
      return 12
    }

    return fps
  }, [fps])

  useEffect(() => {
    if (!src) return

    const image = new window.Image()
    image.src = src
    image.onload = () => {
      setNaturalSize({ width: image.naturalWidth, height: image.naturalHeight })
      setImageElement(image)

      const offscreenCanvas = document.createElement("canvas")
      offscreenCanvas.width = image.naturalWidth
      offscreenCanvas.height = image.naturalHeight
      const context = offscreenCanvas.getContext("2d")

      if (!context) {
        setDetectedFrames([])
        return
      }

      context.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
      context.drawImage(image, 0, 0)

      const imageData = context.getImageData(
        0,
        0,
        offscreenCanvas.width,
        offscreenCanvas.height,
      )

      const width = imageData.width
      const height = imageData.height
      const data = imageData.data
      const rowThreshold = 3
      const minFrameHeight = 3

      const frameBands: Array<{ y: number; height: number }> = []
      let bandStart = -1

      for (let y = 0; y < height; y += 1) {
        let opaquePixelsInRow = 0

        for (let x = 0; x < width; x += 1) {
          const alpha = data[(y * width + x) * 4 + 3]
          if (alpha > 8) {
            opaquePixelsInRow += 1
          }
        }

        const isOpaqueRow = opaquePixelsInRow >= rowThreshold

        if (isOpaqueRow && bandStart === -1) {
          bandStart = y
          continue
        }

        if (!isOpaqueRow && bandStart !== -1) {
          const bandHeight = y - bandStart
          if (bandHeight >= minFrameHeight) {
            frameBands.push({ y: bandStart, height: bandHeight })
          }
          bandStart = -1
        }
      }

      if (bandStart !== -1) {
        const bandHeight = height - bandStart
        if (bandHeight >= minFrameHeight) {
          frameBands.push({ y: bandStart, height: bandHeight })
        }
      }

      setDetectedFrames(frameBands)
    }

    image.onerror = () => {
      setImageElement(null)
      setDetectedFrames([])
    }
  }, [src])

  useEffect(() => {
    if (!triggerKey || triggerKey < 1 || totalFrames < 1) {
      return
    }

    setCurrentFrame(0)
    setIsPlaying(true)

    let frame = 0
    const frameDuration = Math.max(16, Math.round(1000 / safeFps))

    const intervalId = window.setInterval(() => {
      frame += 1

      if (frame >= totalFrames) {
        window.clearInterval(intervalId)
        setIsPlaying(false)
        onCompleteRef.current?.()
        return
      }

      setCurrentFrame(frame)
    }, frameDuration)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [triggerKey, totalFrames, safeFps])

  const frameSize = useMemo(() => {
    if (!naturalSize || totalFrames < 1) return null

    if (detectedFrames.length > 0) {
      const tallestFrame = Math.max(
        ...detectedFrames.map((frame) => frame.height),
      )

      return {
        width: Math.max(1, naturalSize.width * scale),
        height: Math.max(1, tallestFrame * scale),
      }
    }

    const scaledWidth = naturalSize.width * scale
    const frameHeight = (naturalSize.height / totalFrames) * scale

    return {
      width: Math.max(1, scaledWidth),
      height: Math.max(1, frameHeight),
    }
  }, [naturalSize, totalFrames, detectedFrames, scale])

  useEffect(() => {
    if (!isPlaying || !frameSize || !naturalSize || !imageElement) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    canvas.width = Math.max(1, Math.round(frameSize.width))
    canvas.height = Math.max(1, Math.round(frameSize.height))
    context.clearRect(0, 0, canvas.width, canvas.height)

    let sourceY = 0
    let sourceHeight = naturalSize.height / totalFrames

    if (detectedFrames.length > 0) {
      const frameBand = detectedFrames[Math.min(currentFrame, totalFrames - 1)]
      if (frameBand) {
        sourceY = frameBand.y
        sourceHeight = frameBand.height
      }
    } else {
      sourceY = currentFrame * sourceHeight
    }

    const destinationHeight = sourceHeight * scale
    const destinationY = Math.round((canvas.height - destinationHeight) / 2)

    context.imageSmoothingEnabled = false
    context.drawImage(
      imageElement,
      0,
      sourceY,
      naturalSize.width,
      sourceHeight,
      0,
      destinationY,
      canvas.width,
      destinationHeight,
    )
  }, [
    isPlaying,
    frameSize,
    naturalSize,
    imageElement,
    currentFrame,
    totalFrames,
    detectedFrames,
    scale,
  ])

  if (!isPlaying || !frameSize) {
    return null
  }

  return (
    <div
      className={className}
      style={{
        width: frameSize.width,
        height: frameSize.height,
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: frameSize.width,
          height: frameSize.height,
          imageRendering: "pixelated",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </div>
  )
}

export default VerticalSpriteEffect
