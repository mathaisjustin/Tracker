"use client"

import { useState } from "react"
import { addEntry } from "@/lib/api/entries"
import type { Habit } from "@/lib/types/habits"

interface UseEntriesProps {
  habits: Habit[]
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>
}

export function useEntries({ habits, setHabits }: UseEntriesProps) {
  const [isLogging, setIsLogging] = useState(false)

  const logProgress = async (habitId: string, cost?: number) => {
    // Optimistic update
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h

        const hasGoal = h.target !== null && h.target !== undefined

        // Already at cap — don't increment
        if (hasGoal && h.current >= Number(h.target)) return h

        const next = h.current + 1
        return {
          ...h,
          current: next,
          completed: hasGoal ? next >= Number(h.target) : false,
        }
      })
    )

    setIsLogging(true)
    try {
      const result = await addEntry(habitId, cost)

      // Sync back if backend says capped
      if (result.capped) {
        setHabits((prev) =>
          prev.map((h) => {
            if (h.id !== habitId) return h
            return {
              ...h,
              current: result.quantity,
              completed: h.target !== null
                ? result.quantity >= Number(h.target)
                : false,
            }
          })
        )
      }
    } catch (err) {
      console.error("Log progress failed:", err)

      // Rollback
      setHabits((prev) =>
        prev.map((h) => {
          if (h.id !== habitId) return h
          const prevVal = Math.max(0, h.current - 1)
          const hasGoal = h.target !== null && h.target !== undefined
          return {
            ...h,
            current: prevVal,
            completed: hasGoal ? prevVal >= Number(h.target) : false,
          }
        })
      )
    } finally {
      setIsLogging(false)
    }
  }

  return { logProgress, isLogging }
}