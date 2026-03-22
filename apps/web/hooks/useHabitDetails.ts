"use client"

import { useEffect, useState } from "react"
import { getHabitDetails, logHabitEntry } from "@/lib/api/habits"
import { useAuth } from "@/lib/AuthProvider"
import type { HabitDetails } from "@/lib/types/habitDetails"

type UseHabitDetailsResult = {
  habit: HabitDetails | null
  isLoading: boolean
  increment: () => Promise<void>
  decrement: () => Promise<void>
}

export function useHabitDetails(habitId: string): UseHabitDetailsResult {
  const { session, loading } = useAuth()

  const [habit, setHabit] = useState<HabitDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ─── Fetch ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      if (loading) return
      if (!session || !habitId) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        const data = await getHabitDetails(session.access_token, habitId)
        if (!cancelled) setHabit(data)
      } catch (err) {
        console.error("Failed to fetch habit details:", err)
        if (!cancelled) setHabit(null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchData()

    return () => { cancelled = true }
  }, [session, loading, habitId])

  // ─── Shared optimistic updater ────────────────────────────────────────────────

  function applyOptimistic(prev: HabitDetails, nextValue: number): HabitDetails {
    const goal = prev.goal ?? Infinity
    return {
      ...prev,
      todayValue: nextValue,
      progress: Math.min((nextValue / goal) * 100, 100),
      recentEntries: prev.recentEntries.map((entry, i) =>
        i === 0
          ? {
              ...entry,
              value: nextValue,
              status:
                nextValue >= goal
                  ? "complete"
                  : nextValue > 0
                  ? "in_progress"
                  : "missed",
            }
          : entry
      ),
    }
  }

  // ─── Shared reconcile after server responds ───────────────────────────────────

  function reconcile(serverValue: number) {
    setHabit((prev) => {
      if (!prev) return prev
      return applyOptimistic(prev, serverValue)
    })
  }

  // ─── Increment (+) ────────────────────────────────────────────────────────────

  const increment = async () => {
    if (!session?.access_token || !habit) return

    const previous = habit
    const nextValue = habit.todayValue + 1

    setHabit(applyOptimistic(habit, nextValue))

    try {
      const result = await logHabitEntry(session.access_token, habit.id, "increment")
      reconcile(result.quantity)
    } catch (err) {
      console.error("Increment failed:", err)
      setHabit(previous)
    }
  }

  // ─── Decrement (−) ────────────────────────────────────────────────────────────

  const decrement = async () => {
    if (!session?.access_token || !habit) return

    const previous = habit
    const nextValue = Math.max(0, habit.todayValue - 1)

    setHabit(applyOptimistic(habit, nextValue))

    try {
      const result = await logHabitEntry(session.access_token, habit.id, "decrement")
      reconcile(result.quantity)
    } catch (err) {
      console.error("Decrement failed:", err)
      setHabit(previous)
    }
  }

  return { habit, isLoading, increment, decrement }
}