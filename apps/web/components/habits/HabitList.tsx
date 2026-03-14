"use client"

import { HabitItem } from "./HabitItem"
import type { Habit } from "@/lib/types/habits"
import type { FilterTab } from "@/lib/types/habits"

interface HabitListProps {
  habits: Habit[]
  filter: FilterTab
  onLogProgress?: (habitId: string) => void
  onComplete?: (habitId: string) => void
}

function filterHabits(habits: Habit[], filter: FilterTab): Habit[] {
  if (filter === "all") return habits
  if (filter === "active") return habits.filter((h) => !h.completed)
  if (filter === "done") return habits.filter((h) => h.completed)
  return habits
}

export function HabitList({
  habits,
  filter,
  onLogProgress,
  onComplete,
}: HabitListProps) {
  const filtered = filterHabits(habits, filter)

  return (
    <div className="flex flex-col gap-3">
      {filtered.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onPlus={onLogProgress}
          onComplete={onComplete}
        />
      ))}
    </div>
  )
}
