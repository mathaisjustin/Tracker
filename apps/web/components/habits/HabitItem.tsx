import { useRef, useState, type PointerEvent } from "react"
import { Archive, Check, Plus, TrendingDown, TrendingUp } from "lucide-react"
import { isAfter, startOfDay } from "date-fns"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Habit } from "@/lib/types/habits"

import { HabitIcon } from "./HabitIcon"

interface HabitItemProps {
  habit: Habit
  selectedDate: Date
  onPlus?: (habitId: string) => void
  onComplete?: (habitId: string) => void
  onArchive?: (habitId: string) => void
}

function formatProgress(habit: Habit): string {
  if (habit.completed) return "Done"
  if (habit.targetUnit === "steps") {
    return `${habit.current >= 1000 ? `${habit.current / 1000}k` : habit.current} / ${habit.target}`
  }
  if (habit.targetUnit === "minutes") {
    return `${habit.current} / ${habit.target}`
  }
  return `${habit.current} / ${habit.target}`
}

export function HabitItem({ habit, selectedDate, onPlus, onComplete, onArchive }: HabitItemProps) {
  const StreakIcon = habit.streakType === "streak" ? TrendingUp : TrendingDown
  const streakColor = habit.streakType === "streak" ? "text-green-500" : "text-red-500"
  const streakLabel = habit.streakType === "streak"
    ? `${habit.streak} day streak`
    : `${habit.streak} day miss`

  const isFutureDate = isAfter(startOfDay(selectedDate), startOfDay(new Date()))
  const isTodayDate = !isFutureDate && startOfDay(selectedDate).getTime() === startOfDay(new Date()).getTime()
  const canLogProgress = isTodayDate
  const canArchive = isTodayDate

  const startXRef = useRef<number | null>(null)
  const startOffsetRef = useRef(0)
  const draggingRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState(0)
  const actionSlotSize = 44
  const rightActionSize = canLogProgress ? actionSlotSize : 0
  const maxReveal = canArchive ? actionSlotSize : 0
  const revealThreshold = 22
  const leftSlotWidth = offset
  const rightSlotWidth = Math.max(0, rightActionSize - offset)
  const interactionReady = leftSlotWidth >= actionSlotSize * 0.55
  const rightActionReady = rightSlotWidth >= actionSlotSize * 0.55

  const resetPosition = () => {
    setOffset(0)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!canArchive) return
    startXRef.current = event.clientX
    startOffsetRef.current = offset
    draggingRef.current = true
    setIsDragging(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || startXRef.current === null) return

    const delta = event.clientX - startXRef.current
    const next = Math.min(maxReveal, Math.max(0, startOffsetRef.current + delta))
    setOffset(next)
  }

  const handlePointerEnd = () => {
    if (!draggingRef.current) return

    draggingRef.current = false
    setIsDragging(false)
    startXRef.current = null

    const shouldReveal = offset > revealThreshold
    setOffset(shouldReveal ? maxReveal : 0)
  }

  const handleArchive = () => {
    resetPosition()
    onArchive?.(habit.id)
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="grid min-h-16 w-full items-center gap-2 touch-pan-y"
        style={{
          gridTemplateColumns: `${leftSlotWidth}px minmax(0, 1fr) ${rightSlotWidth}px`,
          transition: isDragging ? "none" : "grid-template-columns 260ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
        role="group"
        aria-label={habit.name}
      >
        <div className="overflow-hidden">
          {canArchive ? (
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition active:scale-[0.98] hover:bg-orange-400"
              style={{
                transform: `translateX(${leftSlotWidth - actionSlotSize}px)`,
                transition: isDragging ? "none" : "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              onClick={handleArchive}
              onPointerDown={(event) => event.stopPropagation()}
              disabled={!interactionReady}
              aria-label="Archive habit"
            >
              <Archive className="size-4" />
            </button>
          ) : null}
        </div>

        <div className="relative flex min-h-16 min-w-0 items-center gap-4 rounded-full px-4 py-3" style={{ backgroundColor: habit.color + "20" }}>
          <HabitIcon icon={habit.icon} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white">{habit.name}</p>
            <p className={cn("flex items-center gap-1 text-sm", streakColor)}>
              <StreakIcon className="size-3.5" />
              {streakLabel}
            </p>
          </div>
          <p className="text-sm text-zinc-400">{formatProgress(habit)}</p>
        </div>

        <div className="flex items-center justify-end overflow-hidden">
          {canLogProgress ? (
            habit.completed ? (
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-9 rounded-full bg-zinc-800 text-green-500 transition-transform duration-200 hover:bg-zinc-700 hover:text-green-400"
                style={{
                  transform: `translateX(${actionSlotSize - rightSlotWidth}px)`,
                }}
                aria-label="Completed"
                onClick={() => onComplete?.(habit.id)}
                onPointerDown={(event) => event.stopPropagation()}
                disabled={!rightActionReady}
              >
                <Check className="size-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-9 rounded-full bg-zinc-800 text-zinc-400 transition-transform duration-200 hover:bg-zinc-700 hover:text-white"
                style={{
                  transform: `translateX(${actionSlotSize - rightSlotWidth}px)`,
                }}
                aria-label="Log progress"
                onClick={() => onPlus?.(habit.id)}
                onPointerDown={(event) => event.stopPropagation()}
                disabled={!rightActionReady}
              >
                <Plus className="size-5" />
              </Button>
            )
          ) : null}
        </div>
      </div>
    </div>
  )
}
