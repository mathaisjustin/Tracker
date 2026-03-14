"use client"

import { useState } from "react"
import { DateSelector } from "./DateSelector"
import { FilterTabs } from "./FilterTabs"
import { HabitCompletionSummary } from "./HabitCompletionSummary"
import { HabitList } from "./HabitList"
import { HabitsHeader } from "./HabitsHeader"
import type { FilterTab } from "@/lib/types/habits"
import type { DateStatus } from "@/lib/types/habits"

import type { Habit } from "@/lib/types/habits"

interface HabitsPageShellProps {
  habits: Habit[]
  dateStatuses: DateStatus[]
  selectedDate: Date
  onSelectDate: (date: Date) => void
  onLogProgress?: (habitId: string) => void
  onComplete?: (habitId: string) => void
}

export function HabitsPageShell({
  habits,
  dateStatuses,
  selectedDate,
  onSelectDate,
  onLogProgress,
  onComplete,
}: HabitsPageShellProps) {
  const [filter, setFilter] = useState<FilterTab>("all")

  const completed = habits.filter((h) => h.completed).length
  const total = habits.length

  return (
    <div className="space-y-6">
      <HabitsHeader date={selectedDate} />
      <DateSelector
        selectedDate={selectedDate}
        onSelect={onSelectDate}
        datesWithStatus={dateStatuses}
      />
      <FilterTabs activeFilter={filter} onFilterChange={setFilter} />
      <HabitCompletionSummary completed={completed} total={total} />
      <HabitList
        habits={habits}
        filter={filter}
        onLogProgress={onLogProgress}
        onComplete={onComplete}
      />
    </div>
  )
}
