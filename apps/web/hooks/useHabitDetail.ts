"use client"

import { useEffect, useMemo, useState } from "react"

import { useAuth } from "@/lib/AuthProvider"
import { getHabitEntries, getHabits } from "@/lib/api/habits"
import type { Habit } from "@/lib/types/habits"
import type { HabitDetailModel, HabitDetailTab, HabitEntry, HabitStatsModel } from "@/components/habits/detail"

function buildFallbackHabit(habitId: string): Habit {
  return {
    id: habitId,
    name: "Water",
    icon: "water",
    target: "8",
    targetUnit: "cups",
    current: 4,
    completed: false,
    streak: 4,
    streakType: "streak",
    color: "#06b6d4",
  }
}

function buildFallbackEntries(habitId: string): HabitEntry[] {
  const base = new Date()
  const days = [0, 1, 2, 3, 4]
  const quantities = [4, 8, 5, 0, 8]

  return days.map((offset, idx) => {
    const date = new Date(base)
    date.setDate(base.getDate() - offset)
    return {
      id: `mock-entry-${idx}`,
      habit_id: habitId,
      user_id: "mock-user",
      quantity: quantities[idx],
      created_at: date.toISOString(),
      cost: null,
      note: null,
    }
  })
}

function parseTarget(target: string): number {
  if (target === "10k") return 10000
  if (target === "30m") return 30
  return parseInt(target, 10) || 1
}

function buildMockStats(entries: HabitEntry[], targetQuantity: number): HabitStatsModel {
  const totalLogged = entries.reduce((sum, entry) => sum + Number(entry.quantity || 0), 0)
  const perfectDays = entries.filter((entry) => Number(entry.quantity || 0) >= targetQuantity).length
  const averagePerDay = entries.length > 0 ? totalLogged / entries.length : 0

  const last7Days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day, index) => {
    const quantity = Math.max(0, Math.round(targetQuantity * (0.4 + ((index % 4) * 0.2))))
    const ratio = quantity / Math.max(1, targetQuantity)
    return {
      day,
      quantity,
      status: ratio >= 1 ? "goal" : ratio > 0.45 ? "partial" : "missed",
    } as const
  })

  const byWeekday = [
    { day: "Mo", value: 5.6 },
    { day: "Tu", value: 4.4 },
    { day: "We", value: 3.1 },
    { day: "Th", value: 6.6 },
    { day: "Fr", value: 5.2 },
    { day: "Sa", value: 7.2 },
    { day: "Su", value: 3.8 },
  ]

  const levels = ["none", "low", "mid", "high"] as const
  const heatmap = Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 10 }, (_, col) => levels[(row + col) % levels.length])
  )

  return {
    bestStreak: 12,
    totalLogged,
    perfectDays,
    averagePerDay,
    last7Days,
    byWeekday,
    heatmap,
  }
}

export function useHabitDetail(habitId: string) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<HabitDetailTab>("log")
  const [habit, setHabit] = useState<Habit | null>(null)
  const [entries, setEntries] = useState<HabitEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!habitId) {
        setHabit(null)
        setEntries([])
        return
      }

      if (!user?.id) {
        setHabit(buildFallbackHabit(habitId))
        setEntries(buildFallbackEntries(habitId))
        return
      }

      setIsLoading(true)
      try {
        const today = new Date().toISOString().slice(0, 10)
        const [habits, habitEntries] = await Promise.all([
          getHabits(user.id, today),
          getHabitEntries(habitId),
        ])

        if (cancelled) return

        const selectedHabit = habits.find((item) => item.id === habitId) ?? buildFallbackHabit(habitId)
        setHabit(selectedHabit)
        setEntries(habitEntries.length > 0 ? habitEntries : buildFallbackEntries(habitId))
      } catch (_error) {
        if (cancelled) return
        setHabit(buildFallbackHabit(habitId))
        setEntries(buildFallbackEntries(habitId))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [habitId, user?.id])

  const detail = useMemo<HabitDetailModel | null>(() => {
    if (!habit) return null

    const targetQuantity = parseTarget(habit.target)
    const todayQuantity = entries.length > 0 ? Number(entries[0].quantity || 0) : habit.current

    return {
      habit,
      todayQuantity,
      targetQuantity,
      entries,
      stats: buildMockStats(entries, targetQuantity),
    }
  }, [entries, habit])

  return {
    isLoading,
    activeTab,
    setActiveTab,
    detail,
  }
}
