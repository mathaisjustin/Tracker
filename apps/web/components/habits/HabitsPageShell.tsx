"use client"

import { useState } from "react"
import { DateSelector } from "./DateSelector"
import { FilterTabs } from "./FilterTabs"
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
  onArchive?: (habitId: string) => void
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
        />
      )}
    </div>
  )
}