"use client"

import StatsOverviewCards from "./components/StatsOverviewCards"
import MonthlyProgressCalendar from "./components/MonthlyProgressCalendar"
import HabitCompletionStats, { HabitStat } from "./components/HabitCompletionStats"
import ActivityHeatmap from "./components/ActivityHeatmap"

type StatsViewProps = {
  habit: {
    streak: number
    completions: number
  }
}

export function StatsView({ habit }: StatsViewProps) {

  const stats = [
    { label: "Best Streak", value: 12, sub: "days · Meditate" },
    { label: "Completion", value: "74%", sub: "this month" },
    { label: "Total Entries", value: 86, sub: "across all habits" },
    { label: "Perfect Days", value: 9, sub: "all habits done" },
  ]

  const mockCalendar = [
    { date: "2026-03-13", progress: 100 },
    { date: "2026-03-15", progress: 80 },
    { date: "2026-03-16", progress: 60 },
  ]

  const habitCompletion: HabitStat[] = [
    { name: "Meditate", percent: 92, color: "green" },
    { name: "Walk", percent: 78, color: "green" },
    { name: "Water", percent: 61, color: "yellow" },
    { name: "Read", percent: 33, color: "red" },
  ]

const activity = [
  [1,2,3,2,1,0,2,1,2,3,1,2,0,1,2,3,2,1,0],
  [3,0,1,2,3,2,1,3,2,1,2,1,0,0,1,2,3,2,1],
  [2,1,1,2,3,0,0,1,2,3,1,0,1,2,3,1,0,2,1],
  [3,1,2,2,1,3,2,0,1,2,3,1,2,1,2,3,0,1,2],
  [1,2,3,0,1,1,2,3,2,1,0,1,2,2,3,1,2,0,1],
]

  return (
    <div className="space-y-6">

      <StatsOverviewCards stats={stats} />

      <MonthlyProgressCalendar data={mockCalendar} />

      <HabitCompletionStats
        title="Habit Completion — March"
        habits={habitCompletion}
      />

      <ActivityHeatmap
        title="Activity — Last 10 Weeks"
        weeks={activity}
      />

    </div>
  )
}