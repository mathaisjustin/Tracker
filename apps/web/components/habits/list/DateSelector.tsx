"use client"

import { useRef, type PointerEvent, type TouchEvent } from "react"
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

  const swipeStartX = useRef<number | null>(null)
  const swipeHandled = useRef(false)
  const swipeThreshold = 42

  const shiftWeek = (deltaX: number) => {
    if (Math.abs(deltaX) < swipeThreshold) return
    // Requested behavior: swipe left -> previous week, swipe right -> next week.
    onSelect(addDays(selectedDate, deltaX > 0 ? -7 : 7))
  }

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getStatusForDate = (d: Date) => {
    const dateStr = format(d, "yyyy-MM-dd")
    return datesWithStatus.find((s) => s.date === dateStr)?.hasActivity ?? false
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swipeStartX.current = event.clientX
    swipeHandled.current = false
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (swipeStartX.current === null || swipeHandled.current) return

    const deltaX = event.clientX - swipeStartX.current
    if (Math.abs(deltaX) < swipeThreshold) return

    shiftWeek(deltaX)
    swipeHandled.current = true
  }

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0]
    if (!touch) return
    swipeStartX.current = touch.clientX
    swipeHandled.current = false
  }

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (swipeStartX.current === null || swipeHandled.current) {
      swipeStartX.current = null
      swipeHandled.current = false
      return
    }

    const touch = event.changedTouches[0]
    if (!touch) return
    const deltaX = touch.clientX - swipeStartX.current
    shiftWeek(deltaX)
    swipeStartX.current = null
    swipeHandled.current = false
  }

  const handlePointerEnd = () => {
    swipeStartX.current = null
    swipeHandled.current = false
  }

  return (
    <div
      className="space-y-3 touch-pan-y"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
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
      <div className={cn("flex justify-between gap-1")}>
        {weekDates.map((d) => {
          const hasActivity = getStatusForDate(d)
          const dateStr = format(d, "yyyy-MM-dd")
          const status = datesWithStatus.find((s) => s.date === dateStr)
          const completionRate = Math.max(0, Math.min(1, status?.completionRate ?? 0))

          return (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => onSelect(d)}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <span
                className="relative grid size-10 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(white ${Math.round(completionRate * 360)}deg, black ${Math.round(completionRate * 360)}deg)`,
                  padding: "2.5px",
                }}
              >
                <span className="flex size-full items-center justify-center rounded-full bg-zinc-950 text-sm font-medium text-white">
                  {format(d, "d")}
                </span>
              </span>
              <div className="flex gap-1">
                <span className={cn("size-1 rounded-full", hasActivity ? "bg-white" : "bg-transparent")} />
                {format(d, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") && (
                  <span className="size-1 rounded-full bg-white" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
