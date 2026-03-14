"use client"

import { format, startOfWeek, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import type { DateStatus } from "@/lib/types/habits"

interface DateSelectorProps {
  selectedDate: Date
  onSelect: (date: Date) => void
  datesWithStatus: DateStatus[]
}

const DAY_LABELS = ["SA", "SU", "MO", "TU", "WE", "TH", "FR"]

export function DateSelector({
  selectedDate,
  onSelect,
  datesWithStatus,
}: DateSelectorProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 })
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getStatusForDate = (d: Date) => {
    const dateStr = format(d, "yyyy-MM-dd")
    return datesWithStatus.find((s) => s.date === dateStr)?.hasActivity ?? false
  }

  const isSelected = (d: Date) =>
    format(d, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  const isFuture = (d: Date) => d > new Date()

  return (
    <div className="space-y-3">
      <div className="flex justify-between gap-1">
        {DAY_LABELS.map((label) => (
          <span
            key={label}
            className="flex-1 text-center text-xs text-zinc-500"
          >
            {label}
          </span>
        ))}
      </div>
      <div className="flex justify-between gap-1">
        {weekDates.map((d) => {
          const selected = isSelected(d)
          const hasActivity = getStatusForDate(d)
          const future = isFuture(d)

          return (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => !future && onSelect(d)}
              disabled={future}
              className={cn(
                "flex flex-1 flex-col items-center gap-1",
                future && "opacity-50"
              )}
            >
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  selected && "bg-white text-black",
                  !selected && !future && "text-white hover:bg-zinc-800",
                  !selected && future && "text-zinc-500"
                )}
              >
                {format(d, "d")}
              </span>
              <span
                className={cn(
                  "size-1 rounded-full",
                  hasActivity ? "bg-white" : "bg-transparent"
                )}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
