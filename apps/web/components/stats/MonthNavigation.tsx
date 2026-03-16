"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface MonthNavigationProps {
  month: string
  year: number
  onPrev: () => void
  onNext: () => void
}

export default function MonthNavigation({
  month,
  year,
  onPrev,
  onNext,
}: MonthNavigationProps) {
  return (
    <div className="flex items-center justify-between mb-6">

      <button
        onClick={onPrev}
        className="p-2 rounded-lg hover:bg-zinc-800 transition"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="text-lg font-semibold tracking-wide">
        {month} {year}
      </div>

      <button
        onClick={onNext}
        className="p-2 rounded-lg hover:bg-zinc-800 transition"
      >
        <ChevronRight size={20} />
      </button>

    </div>
  )
}