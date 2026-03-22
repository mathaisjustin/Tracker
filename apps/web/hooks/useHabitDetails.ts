"use client"

import { useState, useEffect } from "react"
import { getHabitDetails } from "@/lib/api/habits"
import { logHabitEntry } from "@/lib/api/entries"
import type { HabitDetails } from "@/lib/types/habitDetails"
import { useAuth } from "@/lib/AuthProvider"

export function useHabitDetails(habitId: string) {
  const { session, loading } = useAuth()

  const [habit, setHabit] = useState<HabitDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /* -------------------------------- */
  /* FETCH DETAILS */
  /* -------------------------------- */

useEffect(() => {
  let cancelled = false
console.log("EFFECT RUN", { session, loading, habitId })
  async function fetchData() {
    if (loading) {
      setIsLoading(true)
      return
    }

    if (!session || !habitId) return

    const token = session.access_token

    setIsLoading(true)

    try {
      const data = await getHabitDetails(token, habitId)

      if (!cancelled) {
        setHabit(data)
      }
    } catch (err) {
      console.error("Failed to fetch habit details:", err)
      if (!cancelled) setHabit(null)
    } finally {
      if (!cancelled) setIsLoading(false)
    }
  }

  fetchData()

  return () => {
    cancelled = true
  }
}, [session, loading, habitId])

  /* -------------------------------- */
  /* INCREMENT (+) */
  /* -------------------------------- */

  const increment = async () => {
    if (!session?.access_token || !habit) return

    const previous = habit

    // ✅ optimistic update
    const nextValue = habit.todayValue + 1
    const goal = habit.goal ?? Infinity

    setHabit({
      ...habit,
      todayValue: nextValue,
      progress: Math.min((nextValue / goal) * 100, 100),
    })

    try {
      await logHabitEntry(habit.id, "increment", 1)
    } catch (err) {
      console.error("Increment failed:", err)

      // ❌ rollback
      setHabit(previous)
    }
  }

  /* -------------------------------- */
  /* DECREMENT (−) */
  /* -------------------------------- */

  const decrement = async () => {
    if (!session?.access_token || !habit) return

    const previous = habit

    const nextValue = Math.max(0, habit.todayValue - 1)
    const goal = habit.goal ?? Infinity

    setHabit({
      ...habit,
      todayValue: nextValue,
      progress: Math.min((nextValue / goal) * 100, 100),
    })

    try {
      await logHabitEntry(habit.id, "decrement", 1)
    } catch (err) {
      console.error("Decrement failed:", err)

      // ❌ rollback
      setHabit(previous)
    }
  }

  return {
    habit,
    isLoading,
    increment,
    decrement,
  }
}