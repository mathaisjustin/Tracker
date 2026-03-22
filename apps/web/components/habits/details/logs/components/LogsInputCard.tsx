"use client"

import { Minus, Plus } from "lucide-react"

type LogsInputCardProps = {
  value: number
  unit?: string
  onIncrement?: () => void
  onDecrement?: () => void
  isReadOnly?: boolean // true when viewing a past/future date
}

export function LogsInputCard({
  value,
  unit = "cups",
  onIncrement,
  onDecrement,
  isReadOnly = false,
}: LogsInputCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

      <p className="text-xs tracking-widest text-zinc-500 mb-6">
        LOG TODAY
      </p>

      <div className="flex items-center justify-between">

        {/* Minus Button */}
        <button
          onClick={isReadOnly ? undefined : onDecrement}
          disabled={isReadOnly}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition
            ${isReadOnly
              ? "bg-zinc-900/40 text-zinc-700 cursor-not-allowed"
              : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
            }`}
        >
          <Minus size={18} />
        </button>

        {/* Value */}
        <div className="text-center">
          <p className={`text-4xl font-semibold ${isReadOnly ? "text-zinc-600" : "text-white"}`}>
            {value}
          </p>
          <p className="text-sm text-zinc-500">{unit}</p>
          {isReadOnly && (
            <p className="text-xs text-zinc-600 mt-1">View only</p>
          )}
        </div>

        {/* Plus Button */}
        <button
          onClick={isReadOnly ? undefined : onIncrement}
          disabled={isReadOnly}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition
            ${isReadOnly
              ? "bg-zinc-200/10 text-zinc-700 cursor-not-allowed"
              : "bg-white text-black hover:opacity-90"
            }`}
        >
          <Plus size={18} />
        </button>

      </div>

    </div>
  )
}