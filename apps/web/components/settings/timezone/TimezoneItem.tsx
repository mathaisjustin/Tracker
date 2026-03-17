// components/settings/timezone/TimezoneItem.tsx

type Props = {
  title: string
  subtitle: string
  selected: boolean
  onClick: () => void
}

export default function TimezoneItem({
  title,
  subtitle,
  selected,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-zinc-900 transition"
    >
      <div>
        <p className="text-white text-sm">{title}</p>
        <p className="text-zinc-400 text-xs">{subtitle}</p>
      </div>

      {/* Radio */}
      <div
        className={`w-5 h-5 rounded-full border ${
          selected ? "border-pink-500 bg-pink-500" : "border-zinc-600"
        }`}
      />
    </div>
  )
}