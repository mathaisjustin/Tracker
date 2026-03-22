"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { format, startOfWeek, addDays } from "date-fns"


type DateStatus = {
  date: string
  hasActivity: boolean
  completionRate: number
}

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

  const [direction, setDirection] = useState(0)
  const swipeThreshold = 42

  const shiftWeek = (deltaX: number) => {
    if (Math.abs(deltaX) < swipeThreshold) return

    const dir = deltaX > 0 ? -1 : 1
    setDirection(dir)

    onSelect(addDays(selectedDate, dir * 7))
  }

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getStatusForDate = (d: Date) => {
    const dateStr = format(d, "yyyy-MM-dd")
    return datesWithStatus.find((s) => s.date === dateStr)?.hasActivity ?? false
  }

  return (
    <div
      className="space-y-3 touch-pan-y"
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
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={weekStart.toISOString()}
          custom={direction}
          initial={{ x: direction > 0 ? 160 : -160, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? -160 : 160, opacity: 0 }}
          transition={{
            x: { type: "spring", stiffness: 180, damping: 22, mass: 0.8 },
            opacity: { duration: 0.25 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > 500

            if (!swipe) return

            shiftWeek(offset.x || velocity.x)
          }}
          whileDrag={{ scale: 0.98 }}
          className="flex justify-between gap-1"
        >
        {weekDates.map((d) => {
          const hasActivity = getStatusForDate(d)
          const dateStr = format(d, "yyyy-MM-dd")
          const status = datesWithStatus.find((s) => s.date === dateStr)
          const completionRate = Math.max(0, Math.min(1, status?.completionRate ?? 0))

          const isToday =
            format(d, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")

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
              <div className="h-2 flex items-center justify-center">
                {isToday && (
                  <motion.span
                    layoutId="today-dot"
                    className="size-1 rounded-full bg-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
            </button>
          )
        })}
        </motion.div> 
      </AnimatePresence> 
    </div>
  )
}
