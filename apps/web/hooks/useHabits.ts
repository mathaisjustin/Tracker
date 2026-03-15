"use client"

import { useState, useEffect } from "react"
import { format, addDays, startOfWeek } from "date-fns"
import { useAuth } from "@/lib/AuthProvider"
import {
  getHabits,
  getDateStatuses,
  logProgress as logProgressRequest,
  archiveHabit as archiveHabitRequest,
} from "@/lib/api/habits"
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

export function useHabits(initialDate?: Date) {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(initialDate ?? new Date())
  const [habits, setHabits] = useState<Habit[]>([])
  const [dateStatuses, setDateStatuses] = useState<DateStatus[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const dateStr = format(selectedDate, "yyyy-MM-dd")
  const weekStartStr = format(startOfWeek(selectedDate, { weekStartsOn: 0 }), "yyyy-MM-dd")
  const weekEndStr = format(addDays(startOfWeek(selectedDate, { weekStartsOn: 0 }), 6), "yyyy-MM-dd")

  useEffect(() => {
    if (!user?.id) {
      setHabits([])
      const weekDates = getWeekDates(selectedDate)
      setDateStatuses(
        weekDates.map((d) => ({
          date: d,
          hasActivity: false,
          completionRate: 0,
          trackedHabits: 0,
          totalHabits: 0,
        }))
      )
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
          getDateStatuses(userId, weekStartStr, weekEndStr),
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
  }, [user?.id, dateStr, weekStartStr, weekEndStr])

  const updateSelectedDateStatusFromHabits = (nextHabits: Habit[]) => {
    const selectedDateStr = format(selectedDate, "yyyy-MM-dd")
    const totalHabits = nextHabits.length
    const trackedHabits = nextHabits.filter((h) => h.current > 0).length

    const completionRate = totalHabits > 0
      ? nextHabits.reduce((sum, h) => {
          const targetNum =
            h.target === "10k" ? 10000
            : h.target === "30m" ? 30
            : parseInt(h.target, 10) || 1
          return sum + Math.min(1, h.current / targetNum)
        }, 0) / totalHabits
      : 0

    setDateStatuses((prev) => {
      const idx = prev.findIndex((d) => d.date === selectedDateStr)
      if (idx === -1) return prev

      const next = [...prev]
      next[idx] = {
        ...next[idx],
        hasActivity: trackedHabits > 0,
        trackedHabits,
        totalHabits,
        completionRate,
      }
      return next
    })
  }

  const logProgress = async (habitId: string) => {
    if (!user?.id) return

    const todayStr = format(new Date(), "yyyy-MM-dd")
    if (dateStr !== todayStr) {
      return
    }

    const snapshot = habits
    const nextHabits = habits.map((h) => {
      if (h.id !== habitId) return h
      const next = h.current + 1
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

    setHabits(nextHabits)
    updateSelectedDateStatusFromHabits(nextHabits)

    try {
      await logProgressRequest(user.id, habitId, 1, dateStr)
    } catch (_err) {
      setHabits(snapshot)
      updateSelectedDateStatusFromHabits(snapshot)
      throw _err
    }
  }

  const completeHabit = (_habitId: string) => {
    // Placeholder for backend - could mark as done
  }

  const archiveHabit = async (habitId: string) => {
    const todayStr = format(new Date(), "yyyy-MM-dd")
    if (dateStr > todayStr) {
      return
    }

    const snapshot = habits
    setHabits(habits.filter((h) => h.id !== habitId))

    try {
      await archiveHabitRequest(habitId)
    } catch (_err) {
      setHabits(snapshot)
      throw _err
    }
  }

  return {
    habits,
    dateStatuses,
    selectedDate,
    setSelectedDate: (d: Date) => setSelectedDate(d),
    isLoading,
    logProgress,
    completeHabit,
    archiveHabit,
  }
}
