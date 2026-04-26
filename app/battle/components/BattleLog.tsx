import React, { useEffect, useRef } from "react"
import { BattleLogEntry } from "@/lib/battle"

interface BattleLogProps {
  battleLog: BattleLogEntry[]
}

const BattleLog = ({ battleLog }: BattleLogProps) => {
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const logElement = logRef.current
    if (!logElement) return

    logElement.scrollTop = logElement.scrollHeight
  }, [battleLog])

  return (
    <div
      ref={logRef}
      className="w-115 max-xl:w-full h-123 overflow-y-auto border-2 border-charmander-blue-400 rounded"
    >
      {battleLog.map((entry, index) =>
        entry.kind === "turn" ? (
          <div
            key={`${entry.message}-${entry.turn}-${index}`}
            className="border-y-2 border-y-charmander-blue-400 py-1"
          >
            <h1 className="text-charmander-blue-300 text-xl font-bold ml-3">
              {entry.message}
            </h1>
          </div>
        ) : entry.kind === "winner" ? (
          <div
            key={`${entry.message}-${entry.turn}-${index}`}
            className="border-y-2 border-y-charmander-blue-400 py-2"
          >
            <h3
              key={`${entry.message}-${entry.turn}-${index}`}
              className="text-orange-400 ml-3 text-center uppercase tracking-widest"
            >
              {entry.message}
            </h3>
          </div>
        ) : (
          <h3
            key={`${entry.message}-${entry.turn}-${index}`}
            className="text-white ml-3 mb-2 mt-2"
          >
            {entry.message}
          </h3>
        ),
      )}
    </div>
  )
}

export default BattleLog
