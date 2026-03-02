interface EVSliderProps {
  statName: string
  value: number
  onChange: (value: number) => void
  maxValue?: number
  remainingEVs: number
  baseStat: number
  calculatedStat: number
}

export default function EVSlider({
  statName,
  value,
  onChange,
  maxValue = 252,
  remainingEVs,
  baseStat,
  calculatedStat,
}: EVSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value)
    onChange(newValue)
  }

  const actualMax = Math.min(maxValue, value + remainingEVs)

  return (
    <div className="grid grid-cols-[100px_130px_1fr_80px] gap-4 items-center">
      {/* Stat Name */}
      <label>
        <h1 className="text-white font-semibold capitalize text-lg text-right">
          {statName}
        </h1>
      </label>

      {/* Base and Calculated Stats */}
      <div className="text-white flex flex-row">
        <h4 className="text-gray-400 text-xl">Base: {baseStat}</h4>
        <h4 className="text-white font-bold text-xl ml-2">
          → {calculatedStat}
        </h4>
      </div>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max={actualMax}
        step="4"
        value={value}
        onChange={handleChange}
        className="custom-slider w-full h-2 bg-gray-700 rounded-lg cursor-pointer"
      />

      {/* EV Value */}
      <h4 className="text-white text-center text-xl">{value} EVs</h4>
    </div>
  )
}
