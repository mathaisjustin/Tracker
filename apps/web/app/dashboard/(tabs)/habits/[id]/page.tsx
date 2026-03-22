"use client"

import { useParams } from "next/navigation"
import { useState } from "react"

import { archiveHabit } from "@/lib/api/habits"
import { useAuth } from "@/lib/AuthProvider"
import { useRouter } from "next/navigation"

import { HabitDetailsHeader } from "@/components/habits/details/HabitDetailsHeader"
import { LogsView } from "@/components/habits/details/logs"
import { StatsView } from "@/components/habits/details/stats"
import { HabitDetailsSwitch } from "@/components/habits/details/HabitDetailsSwitch"

import { useHabitDetails } from "@/hooks/useHabitDetails"

type View = "logs" | "stats"

type EntryStatus = "complete" | "partial" | "missed" | "progress"

type LogEntry = {
  date: string
  value: number
  unit?: string
  status: EntryStatus
}

export default function HabitDetailsPage() {
  const { session, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const habitId = params.id as string

  const [view, setView] = useState<View>("logs")

  const { habit, isLoading, increment, decrement } = useHabitDetails(habitId)

  if (loading) {
    return <div className="p-4 text-zinc-400">Loading Tracker...</div>
  }

  if (!session) {
    return <div className="p-4 text-zinc-400">Unauthorized</div>
  }

  if (isLoading) {
    return <div className="p-4 text-zinc-400">Loading...</div>
  }

  if (!habit) {
    return <div className="p-4 text-zinc-400">Habit not found</div>
  }

  const handleArchive = async () => {
    if (!session?.access_token) return
    try {
      await archiveHabit(session.access_token, habit.id)
      router.back()
    } catch (err) {
      console.error("Archive failed:", err)
    }
  }

  // ─── Map HabitDetails → LogsView shape ───────────────────────────────────────
  // bestDay, avgPerDay, weeklyData, color are now passed through so
  // LogsView can feed them into HabitDetailCard (no-goal variant)

  const mappedHabit = {
    name: habit.name,
    target: habit.goal ?? 0,
    progress: habit.todayValue,
    completedToday:
      habit.goal !== null
        ? habit.todayValue >= habit.goal
        : false,
    streak: habit.streak,
    completions: habit.recentEntries.filter((e) => e.status === "complete").length,
    unit: habit.unit,
    type: habit.type,
    // ↓ these three feed HabitDetailCard when there's no goal
    bestDay: habit.bestDay,
    avgPerDay: habit.avgPerDay,
    weeklyData: habit.weeklyData,
    color: habit.color,
  }

  const mappedEntries: LogEntry[] = habit.recentEntries.map((entry) => ({
    date: entry.date,
    value: entry.value,
    unit: habit.unit,
    status:
      entry.status === "in_progress"
        ? "progress"
        : (entry.status as EntryStatus),
  }))

  return (
    <div className="min-h-screen p-4 pb-28 flex flex-col">

      <HabitDetailsHeader
        name={habit.name}
        onArchive={handleArchive}
      />

      <div className="flex-1">
        {view === "logs" && (
          <LogsView
            habit={mappedHabit}
            entries={mappedEntries}
            onIncrement={increment}
            onDecrement={decrement}
          />
        )}

        {view === "stats" && (
          <StatsView habit={mappedHabit} />
        )}
      </div>

      <HabitDetailsSwitch view={view} onChange={setView} />

    </div>
  )
}