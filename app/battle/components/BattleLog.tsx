import React from "react"
import { BattleLogEntry } from "@/lib/battle"

interface BattleLogProps {
  battleLog: BattleLogEntry[]
}

const BattleLog = ({ battleLog }: BattleLogProps) => {
  return (
    <div className="w-115 max-h-100 overflow-y-auto border-2 border-charmander-blue-400 rounded">
      {battleLog.map((entry, index) =>
        entry.kind === "turn" ? (
          <div className="border-y-2 border-y-charmander-blue-400 mb-2 py-1">
            <h1
              key={`${entry.message}-${entry.turn}-${index}`}
              className="text-charmander-blue-300 text-xl font-bold ml-3"
            >
              {entry.message}
            </h1>
          </div>
        ) : (
          <p
            key={`${entry.message}-${entry.turn}-${index}`}
            className="text-white ml-3 mb-2"
          >
            {entry.message}
          </p>
        ),
      )}
    </div>
  )
}

export default BattleLog
