"use client"

import { useParams } from "next/navigation"
import { useState } from "react"

import { HabitDetailsHeader } from "@/components/habits/details/HabitDetailsHeader"
import { LogsView } from "@/components/habits/details/logs"
import { StatsView } from "@/components/habits/details/stats"
import { HabitDetailsSwitch } from "@/components/habits/details/HabitDetailsSwitch"

type View = "logs" | "stats"

const dummyHabit = {
  id: "1",
  name: "Morning Run",
  description: "Run for 20 minutes every morning",
  color: "#22c55e",
  type: "good",
  createdAt: "2026-03-10",
  streak: 7,
  completions: 15,

  // logs dummy data
  target: 20,
  progress: 8,
  completedToday: false,
}

type EntryStatus = "complete" | "partial" | "missed" | "progress"

type LogEntry = {
  date: string
  value: number
  unit?: string
  status: EntryStatus
}

const dummyEntries: LogEntry[] = [
  {
    date: "Today, Mar 13",
    value: 4,
    unit: "cups",
    status: "progress",
  },
  {
    date: "Thu, Mar 12",
    value: 8,
    unit: "cups",
    status: "complete",
  },
  {
    date: "Wed, Mar 11",
    value: 5,
    unit: "cups",
    status: "partial",
  },
  {
    date: "Tue, Mar 10",
    value: 0,
    unit: "cups",
    status: "missed",
  },
]

export default function HabitDetailsPage() {
  const params = useParams()
  const habitId = params.id as string

  const [view, setView] = useState<View>("logs")

  const habit = dummyHabit // later fetched using habitId

  return (
    <div className="min-h-screen p-4 pb-28 flex flex-col">

      {/* HEADER */}
      <HabitDetailsHeader name={habit.name} />

      {/* MAIN CONTENT */}
      <div className="flex-1">

        {view === "logs" && (
        <LogsView habit={habit} entries={dummyEntries} />
        )}

        {view === "stats" && (
        <StatsView habit={habit} />
        )}

      </div>

      {/* BOTTOM SWITCH */}
      <HabitDetailsSwitch view={view} onChange={setView} />

    </div>
  )
}