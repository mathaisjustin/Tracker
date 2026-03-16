"use client"

import { Minus, Plus } from "lucide-react"

type LogsInputCardProps = {
  value: number
  unit?: string
  onIncrement?: () => void
  onDecrement?: () => void
}

export function LogsInputCard({
  value,
  unit = "cups",
  onIncrement,
  onDecrement,
}: LogsInputCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

      {/* Label */}
      <p className="text-xs tracking-widest text-zinc-500 mb-6">
        LOG TODAY
      </p>

      <div className="flex items-center justify-between">

        {/* Minus Button */}
        <button
          onClick={onDecrement}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-zinc-300 hover:bg-zinc-800 transition"
        >
          <Minus size={18} />
        </button>

        {/* Value */}
        <div className="text-center">
          <p className="text-4xl font-semibold">{value}</p>
          <p className="text-sm text-zinc-500">{unit}</p>
        </div>

        {/* Plus Button */}
        <button
          onClick={onIncrement}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black hover:opacity-90 transition"
        >
          <Plus size={18} />
        </button>

      </div>

    </div>
  )
}