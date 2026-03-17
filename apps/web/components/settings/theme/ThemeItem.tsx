"use client"

type Props = {
  title: string
  subtitle: string
  selected?: boolean
  disabled?: boolean
}

export default function ThemeItem({
  title,
  subtitle,
  selected,
  disabled,
}: Props) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-4 ${
        disabled ? "opacity-50" : "cursor-pointer hover:bg-zinc-900"
      } transition`}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        
        {/* Icon placeholder */}
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
          🌑
        </div>

        <div>
          <p className="text-white text-sm">{title}</p>
          <p className="text-zinc-400 text-xs">{subtitle}</p>
        </div>
      </div>

      {/* RIGHT */}
      {disabled ? (
        <span className="text-xs bg-zinc-800 px-2 py-1 rounded-md">
          Soon
        </span>
      ) : (
        <div
          className={`w-5 h-5 rounded-full border ${
            selected
              ? "border-pink-500 bg-pink-500"
              : "border-zinc-600"
          }`}
        />
      )}
    </div>
  )
}