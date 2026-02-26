interface EVSliderProps {
  statName: string
  value: number
  onChange: (value: number) => void
  maxValue?: number
  remainingEVs: number
}

export default function EVSlider({
  statName,
  value,
  onChange,
  maxValue = 252,
  remainingEVs,
}: EVSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value)
    onChange(newValue)
  }

  const actualMax = Math.min(maxValue, value + remainingEVs)

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between items-center">
        <label className="text-white font-semibold capitalize">
          {statName}
        </label>
        <span className="text-white font-mono">
          {value} / {maxValue}
        </span>
      </div>
      <input
        type="range"
        min="0"
        max={actualMax}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  )
}
