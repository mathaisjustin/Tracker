import { Check, Plus, TrendingDown, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Habit } from "@/lib/types/habits"

import { HabitIcon } from "./HabitIcon"

interface HabitItemProps {
  habit: Habit
  onPlus?: (habitId: string) => void
  onComplete?: (habitId: string) => void
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

export function HabitItem({ habit, onPlus, onComplete }: HabitItemProps) {
  const StreakIcon = habit.streakType === "streak" ? TrendingUp : TrendingDown
  const streakColor = habit.streakType === "streak" ? "text-green-500" : "text-red-500"
  const streakLabel = habit.streakType === "streak"
    ? `${habit.streak} day streak`
    : `${habit.streak} day miss`

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
      )}
    >
      <HabitIcon icon={habit.icon} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-white">{habit.name}</p>
        <p className={cn("flex items-center gap-1 text-sm", streakColor)}>
          <StreakIcon className="size-3.5" />
          {streakLabel}
        </p>
      </div>
      <p className="text-sm text-zinc-400">{formatProgress(habit)}</p>
      {habit.completed ? (
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 rounded-full bg-zinc-800 text-green-500 hover:bg-zinc-700 hover:text-green-400"
          aria-label="Completed"
        >
          <Check className="size-5" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
          aria-label="Log progress"
          onClick={() => onPlus?.(habit.id)}
        >
          <Plus className="size-5" />
        </Button>
      )}
    </div>
  )
}
