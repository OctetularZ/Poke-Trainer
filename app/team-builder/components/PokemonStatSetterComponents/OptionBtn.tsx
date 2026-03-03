interface OptionBtnProps {
  optionName: string
  isSelected?: boolean
  onClick?: () => void
}

export default function OptionBtn({
  optionName,
  isSelected = false,
  onClick,
}: OptionBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md py-1 px-2 transition-all ${
        isSelected
          ? "bg-charmander-blue-400 hover:bg-charmander-blue-500"
          : "bg-gray-600 hover:bg-gray-500"
      }`}
    >
      <h1 className="text-white">{optionName}</h1>
    </button>
  )
}
