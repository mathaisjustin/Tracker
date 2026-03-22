"use client"

import { useState, useEffect, useMemo } from "react"
import { format, startOfWeek, addDays } from "date-fns"
import { getHabits, archiveHabit as archiveHabitApi } from "@/lib/api/habits"
import type { Habit, DateStatus } from "@/lib/types/habits"
import { useAuth } from "@/lib/AuthProvider"

export function useHabits(date?: Date) {
  const { session } = useAuth()

  const [habits, setHabits] = useState<Habit[]>([])
  const [dayProgress, setDayProgress] = useState<number>(0)
  const [dateStatuses, setDateStatuses] = useState<DateStatus[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dateString = date ? format(date, "yyyy-MM-dd") : undefined
  const weekStart = date
    ? format(startOfWeek(date, { weekStartsOn: 0 }), "yyyy-MM-dd")
    : undefined

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      if (!session?.access_token) return

      setIsLoading(true)
      setError(null)

      try {
        const weekRange = weekStart
          ? {
              start: weekStart,
              end: format(addDays(new Date(weekStart), 6), "yyyy-MM-dd"),
            }
          : undefined

        const { habits: fetched, dayProgress: progress, weekStatuses } =
          await getHabits(session.access_token, dateString, weekRange)

        if (!cancelled) {
          setHabits(fetched)
          setDayProgress(progress)
          setDateStatuses(
            weekStatuses.map((s) => ({
              date: s.date,
              hasActivity: s.day_progress > 0,
              completionRate: s.day_progress / 100,
              trackedHabits: 0,
              totalHabits: 0,
            }))
          )
        }
      } catch (err) {
        console.error("Failed to fetch habits:", err)
        if (!cancelled) {
          setHabits([])
          setDayProgress(0)
          setDateStatuses([])
          setError(err instanceof Error ? err.message : "Unknown error")
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchData()

    return () => { cancelled = true }
  }, [session?.access_token, dateString, weekStart])

  const archiveHabit = async (habitId: string) => {
    if (!session?.access_token) return

    const previous = habits

    // Optimistic update — remove from list immediately
    setHabits((prev) => prev.filter((h) => h.id !== habitId))

    try {
      await archiveHabitApi(session.access_token, habitId)
    } catch (err) {
      console.error("Archive failed:", err)
      // Rollback on failure
      setHabits(previous)
    }
  }

  const liveDateStatuses = useMemo(() => {
  if (!dateString) return dateStatuses

  const goalHabits = habits.filter(
    (h) => h.target !== null && h.target !== undefined
  )

  if (goalHabits.length === 0) return dateStatuses

  const completionRate =
    goalHabits.reduce((sum, h) => sum + Math.min(h.current / Number(h.target), 1), 0) /
    goalHabits.length

  return dateStatuses.map((s) =>
    s.date === dateString
      ? { ...s, hasActivity: habits.some((h) => h.completed), completionRate }
      : s
  )
}, [habits, dateStatuses, dateString])

return { habits, setHabits, dayProgress, dateStatuses: liveDateStatuses, isLoading, error, archiveHabit }
}