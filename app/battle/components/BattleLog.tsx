import React from "react"
import { BattleLogEntry } from "@/lib/battle"

interface BattleLogProps {
  battleLog: BattleLogEntry[]
}

const BattleLog = ({ battleLog }: BattleLogProps) => {
  return (
    <div className="w-115 max-h-123 overflow-y-auto border-2 border-charmander-blue-400 rounded">
      {battleLog.map((entry, index) =>
        entry.kind === "turn" ? (
          <div
            key={`${entry.message}-${entry.turn}-${index}`}
            className="border-y-2 border-y-charmander-blue-400 mb-2 py-1"
          >
            <h1 className="text-charmander-blue-300 text-xl font-bold ml-3">
              {entry.message}
            </h1>
          </div>
        ) : (
          <h3
            key={`${entry.message}-${entry.turn}-${index}`}
            className="text-white ml-3 mb-2"
          >
            {entry.message}
          </h3>
        ),
      )}
    </div>
  )
}

export default BattleLog
