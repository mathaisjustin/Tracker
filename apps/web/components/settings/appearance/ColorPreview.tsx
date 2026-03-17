"use client"

type Props = {
  color: string
}

export default function ColorPreview({ color }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
        style={{ backgroundColor: color }}
      >
        JM
      </div>

      {/* Toggle */}
      <div className="w-12 h-7 rounded-full flex items-center justify-end p-1 bg-zinc-700">
        <div
          className="w-5 h-5 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Button */}
      <div
        className="px-4 py-1.5 rounded-full text-white text-sm"
        style={{ backgroundColor: color }}
      >
        Active
      </div>

      {/* Add */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl"
        style={{ backgroundColor: color }}
      >
        +
      </div>
    </div>
  )
}