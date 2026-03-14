"use client"

import { useState, useEffect } from "react"
import { format, addDays, startOfWeek } from "date-fns"
import { useAuth } from "@/lib/AuthProvider"
import { getHabits, getDateStatuses } from "@/lib/api/habits"
import type { Habit } from "@/lib/types/habits"
import type { DateStatus } from "@/lib/types/habits"

function getWeekDates(selectedDate: Date): string[] {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 })
  const dates: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = addDays(weekStart, i)
    dates.push(format(d, "yyyy-MM-dd"))
  }
  return dates
}

export function useHabits() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [habits, setHabits] = useState<Habit[]>([])
  const [dateStatuses, setDateStatuses] = useState<DateStatus[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const dateStr = format(selectedDate, "yyyy-MM-dd")

  useEffect(() => {
    if (!user?.id) {
      setHabits([])
      const weekDates = getWeekDates(selectedDate)
      setDateStatuses(weekDates.map((d) => ({ date: d, hasActivity: false })))
      return
    }

    const userId = user.id
    const weekDates = getWeekDates(selectedDate)
    let cancelled = false

    async function fetchData() {
      setIsLoading(true)
      try {
        const [habitsData, statusesData] = await Promise.all([
          getHabits(userId, dateStr),
          getDateStatuses(weekDates),
        ])
        if (!cancelled) {
          setHabits(habitsData)
          setDateStatuses(statusesData)
        }
      } catch (err) {
        if (!cancelled) setHabits([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchData()
    return () => {
      cancelled = true
    }
  }, [user?.id, dateStr])

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
    isLoading,
    logProgress,
    completeHabit,
  }
}
