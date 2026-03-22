"use client"

import { useState } from "react"
import { DateSelector } from "./DateSelector"
import { FilterTabs } from "./FilterTabs"
import { HabitList } from "./HabitList"
import { HabitsHeader } from "./HabitsHeader"

import type { FilterTab, Habit, DateStatus } from "@/lib/types/habits"

interface HabitsPageShellProps {
  habits: Habit[]
  dateStatuses: DateStatus[]
  selectedDate: Date
  onSelectDate: (date: Date) => void
  onLogProgress?: (habitId: string, cost?: number) => void
  onComplete?: (habitId: string) => void
  onArchive?: (habitId: string) => void
  onEditHabit?: (habitId: string) => void
  onOpenHabit?: (habitId: string) => void
  isLoading?: boolean
}

export function HabitsPageShell({
  habits,
  dateStatuses,
  selectedDate,
  onSelectDate,
  onLogProgress,
  onComplete,
  onArchive,
  onEditHabit,
  onOpenHabit,
  isLoading = false,
}: HabitsPageShellProps) {
  const [filter, setFilter] = useState<FilterTab>("all")

  return (
    <div className="space-y-6">
      <HabitsHeader date={selectedDate} />

      <DateSelector
        selectedDate={selectedDate}
        onSelect={onSelectDate}
        datesWithStatus={dateStatuses}
      />

      <FilterTabs activeFilter={filter} onFilterChange={setFilter} />

      {isLoading ? (
        <p className="text-sm text-zinc-400">Loading habits...</p>
      ) : (
        <HabitList
          habits={habits}
          filter={filter}
          selectedDate={selectedDate}
          onLogProgress={onLogProgress}
          onComplete={onComplete}
          onArchive={onArchive}
          onEditHabit={onEditHabit}
          onOpenHabit={onOpenHabit}
        />
      )}
    </div>
  )
}