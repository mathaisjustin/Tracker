import { useRef, useState, type PointerEvent } from "react"
import { Archive, Check, Pencil, Plus, TrendingDown, TrendingUp } from "lucide-react"
import { isAfter, startOfDay } from "date-fns"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Habit } from "@/lib/types/habits"

import { HabitIcon } from "../shared/HabitIcon"
import { CostInputSheet } from "./CostInputSheet"

interface HabitItemProps {
  habit: Habit
  selectedDate: Date
  onPlus?: (habitId: string, cost?: number) => void
  onComplete?: (habitId: string) => void
  onArchive?: (habitId: string) => void
  onEdit?: (habitId: string) => void
  onOpen?: (habitId: string) => void
}

function formatProgress(habit: Habit): string {
  const hasGoal = habit.target !== null && habit.target !== undefined

  if (!hasGoal) {
    return habit.completed ? "Done" : `${habit.current}`
  }

  if (habit.completed) return "Done"

  if (habit.targetUnit === "steps") {
    const currentFormatted =
      habit.current >= 1000 ? `${habit.current / 1000}k` : habit.current
    return `${currentFormatted} / ${habit.target}`
  }

  return `${habit.current} / ${habit.target}`
}

export function HabitItem({ habit, selectedDate, onPlus, onComplete, onArchive, onEdit, onOpen }: HabitItemProps) {
  const StreakIcon = habit.streakType === "streak" ? TrendingUp : TrendingDown
  const streakColor = habit.streakType === "streak" ? "text-green-500" : "text-red-500"
  const streakLabel = habit.streakType === "streak"
    ? `${habit.streak} day streak`
    : `${habit.streak} day miss`
  const [sheetOpen, setSheetOpen] = useState(false)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasCost = habit.baseCost !== null && habit.baseCost !== undefined && habit.baseCost > 0

  const handlePlusPointerDown = () => {
    if (!hasCost) return
    longPressTimer.current = setTimeout(() => {
      setSheetOpen(true)
    }, 500)
  }

  const handlePlusPointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const handlePlusClick = () => {
    if (!sheetOpen) onPlus?.(habit.id)
  }

  const isFutureDate = isAfter(startOfDay(selectedDate), startOfDay(new Date()))
  const isTodayDate = !isFutureDate && startOfDay(selectedDate).getTime() === startOfDay(new Date()).getTime()
  const canLogProgress = isTodayDate
  const canArchive = isTodayDate
  const canEdit = true

  const startXRef = useRef<number | null>(null)
  const startOffsetRef = useRef(0)
  const draggingRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState(0)
  const actionSlotSize = 44
  const leftActionButtonSize = 40
  const leftActionGap = 8
  const leftActionRailPadding = 4
  const rightActionSize = canLogProgress ? actionSlotSize : 0
  const leftActionCount = (canEdit ? 1 : 0) + (canArchive ? 1 : 0)
  const maxReveal = leftActionCount > 0
    ? leftActionCount * leftActionButtonSize +
      Math.max(0, leftActionCount - 1) * leftActionGap +
      leftActionRailPadding * 2
    : 0
  const canSwipeActions = leftActionCount > 0
  const revealThreshold = Math.max(18, maxReveal * 0.35)
  const leftSlotWidth = offset
  const rightSlotWidth = Math.max(0, rightActionSize - offset)
  const interactionReady = leftSlotWidth >= maxReveal - 2
  const rightActionReady = rightSlotWidth >= actionSlotSize * 0.55

  const resetPosition = () => {
    setOffset(0)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!canSwipeActions) return
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

  const handleEdit = () => {
    resetPosition()
    onEdit?.(habit.id)
  }

  const leftActions = [
    ...(canEdit
      ? [
          {
            key: "edit",
            label: "Edit habit",
            onClick: handleEdit,
            className: "bg-blue-500 hover:bg-blue-400",
            Icon: Pencil,
          },
        ]
      : []),
    ...(canArchive
      ? [
          {
            key: "archive",
            label: "Archive habit",
            onClick: handleArchive,
            className: "bg-orange-500 hover:bg-orange-400",
            Icon: Archive,
          },
        ]
      : []),
  ]

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
        <div className="relative h-full overflow-hidden">
          <div
            className="absolute left-0 top-1/2 flex items-center"
            style={{
              width: `${maxReveal}px`,
              paddingLeft: `${leftActionRailPadding}px`,
              paddingRight: `${leftActionRailPadding}px`,
              columnGap: `${leftActionGap}px`,
              transform: `translateX(${leftSlotWidth - maxReveal}px) translateY(-50%)`,
              transition: isDragging ? "none" : "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {leftActions.map((action) => {
              const Icon = action.Icon

              return (
                <button
                  key={action.key}
                  type="button"
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-full text-white shadow-sm transition active:scale-[0.98]",
                    action.className
                  )}
                  onClick={action.onClick}
                  onPointerDown={(event) => event.stopPropagation()}
                  disabled={!interactionReady}
                  aria-label={action.label}
                >
                  <Icon className="size-4" />
                </button>
              )
            })}
          </div>
        </div>

        <div
          className="relative flex min-h-16 min-w-0 items-center gap-4 rounded-full px-4 py-3"
          style={{ backgroundColor: habit.color + "20" }}
          onClick={() => {
            if (offset === 0) onOpen?.(habit.id)
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (offset !== 0) return
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              onOpen?.(habit.id)
            }
          }}
          aria-label={`Open ${habit.name} details`}
        >
          <HabitIcon icon={habit.icon} />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white">{habit.name}</p>
            {/* <p className={cn("flex items-center gap-1 text-sm", streakColor)}>
              <StreakIcon className="size-3.5" />
              {streakLabel}
            </p> */}
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
              <>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-9 rounded-full bg-zinc-800 text-zinc-400 transition-transform duration-200 hover:bg-zinc-700 hover:text-white"
                  style={{ transform: `translateX(${actionSlotSize - rightSlotWidth}px)` }}
                  aria-label="Log progress"
                  onClick={handlePlusClick}
                  onPointerDown={(e) => {
                    e.stopPropagation()
                    handlePlusPointerDown()
                  }}
                  onPointerUp={handlePlusPointerUp}
                  onPointerLeave={handlePlusPointerUp}
                  disabled={!rightActionReady}
                >
                  <Plus className="size-5" />
                </Button>

                <CostInputSheet
                  isOpen={sheetOpen}
                  defaultCost={habit.baseCost ?? 0}
                  unit={habit.targetUnit || "unit"}
                  onConfirm={(cost) => onPlus?.(habit.id, cost)}
                  onClose={() => setSheetOpen(false)}
                />
              </>
            )
          ) : null}
        </div>
      </div>
    </div>
  )
}
