"use client"

import { HabitsPageShell } from "@/components/habits"
import { useHabits } from "@/hooks/useHabits"

export default function HabitsPage() {
  const {
    habits,
    dateStatuses,
    selectedDate,
    setSelectedDate,
    logProgress,
    completeHabit,
  } = useHabits()

  return (
    <HabitsPageShell
      habits={habits}
      dateStatuses={dateStatuses}
      selectedDate={selectedDate}
      onSelectDate={setSelectedDate}
      onLogProgress={logProgress}
      onComplete={completeHabit}
    />
  )
}
