"use client"

import { useState } from "react"
import { format, addDays, startOfWeek } from "date-fns"
import { MOCK_HABITS } from "@/lib/mocks/habits"
import type { Habit } from "@/lib/types/habits"
import type { DateStatus } from "@/lib/types/habits"

function getMockDateStatuses(selectedDate: Date): DateStatus[] {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 })
  const dates: DateStatus[] = []
  const today = format(new Date(), "yyyy-MM-dd")
  for (let i = 0; i < 7; i++) {
    const d = addDays(weekStart, i)
    const dateStr = format(d, "yyyy-MM-dd")
    dates.push({
      date: dateStr,
      hasActivity: dateStr <= today, // mock: past and today have dots
    })
  }
  return dates
}

export function useHabits() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS)

  const dateStatuses = getMockDateStatuses(selectedDate)

  const logProgress = (habitId: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h
        const next = h.current + (h.targetUnit === "glasses" ? 1 : 1)
        const targetNum =
          h.target === "10k"
            ? 10000
            : h.target === "30m"
              ? 30
              : parseInt(h.target, 10) || 1
        const completed = next >= targetNum
        return {
          ...h,
          current: Math.min(next, targetNum),
          completed,
        }
      })
    )
  }

  const completeHabit = (_habitId: string) => {
    // Placeholder for backend - could mark as done
  }

  return {
    habits,
    dateStatuses,
    selectedDate,
    setSelectedDate: (d: Date) => setSelectedDate(d),
    isLoading: false,
    logProgress,
    completeHabit,
  }
}
