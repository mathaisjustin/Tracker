"use client"

import { useState, useEffect } from "react"
import { getHabits, archiveHabit as archiveHabitApi } from "@/lib/api/habits"
import { addEntry } from "@/lib/api/entries"
import type { Habit } from "@/lib/types/habits"
import { useAuth } from "@/lib/AuthProvider"

export function useHabits() {
  const { session } = useAuth()

  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      if (!session?.access_token) return

      setIsLoading(true)

      try {
        const data = await getHabits(session.access_token)

        if (!cancelled) {
          setHabits(data)
        }
      } catch (err) {
        console.error("Failed to fetch habits:", err)
        if (!cancelled) setHabits([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [session?.access_token])

  /**
   * Archive habit (optimistic update)
   */
  const archiveHabit = async (habitId: string) => {
    if (!session?.access_token) return

    const previous = habits

    // ✅ optimistic UI update
    setHabits((prev) => prev.filter((h) => h.id !== habitId))

    try {
      await archiveHabitApi(session.access_token, habitId)
    } catch (err) {
      console.error("Archive failed:", err)

      // ❌ rollback if failed
      setHabits(previous)
    }
  }

  const logProgress = async (habitId: string) => {
    if (!session?.access_token) return

    // 🔥 optimistic update
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h

        const next = h.current + 1
        const hasGoal = h.target !== null && h.target !== undefined

        return {
          ...h,
          current: next,
          completed: hasGoal ? next >= Number(h.target) : false,
        }
      })
    )

    try {
      await addEntry(habitId)
    } catch (err: any) {
      console.error("Entry failed:", err)

      // ❌ rollback
      setHabits((prev) =>
        prev.map((h) => {
          if (h.id !== habitId) return h

          const prevVal = h.current - 1
          const hasGoal = h.target !== null && h.target !== undefined

          return {
            ...h,
            current: prevVal,
            completed: hasGoal ? prevVal >= Number(h.target) : false,
          }
        })
      )

      // optional: show toast later
    }
  }

  return {
    habits,
    isLoading,
    archiveHabit, // ✅ expose
    logProgress, // ✅ expose
  }
}