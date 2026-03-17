"use client"

type Props = {
  color: string
  selected: boolean
  onClick: () => void
}

export default function ColorItem({ color, selected, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
      style={{ backgroundColor: color }}
    >
      {selected && (
        <div className="text-white text-lg">✓</div>
      )}
    </div>
  )
}