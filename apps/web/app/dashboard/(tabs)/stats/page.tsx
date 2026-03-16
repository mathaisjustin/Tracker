"use client"

import { useState } from "react"

import StatsHeader from "@/components/stats/StatsHeader"
import MonthNavigation from "@/components/stats/MonthNavigation"
import MonthlyProgressCalendar from "@/components/stats/MonthlyProgressCalendar"
import OverallStats from "@/components/stats/OverallStats"
import HabitCompletionRates from "@/components/stats/HabitCompletionRates"
import StreakLeaderboard from "@/components/stats/StreakLeaderboard"
import TrendChart from "@/components/stats/TrendChart"
import BestWorstDays from "@/components/stats/BestWorstDays"
import OverallActivityHeatmap from "@/components/stats/OverallActivityHeatmap"

import { StatsView } from "@/components/habits/details/stats/"

export default function StatsPage() {

  const [selectedHabit, setSelectedHabit] = useState<string | null>(null)

  const habits = [
    { id: "meditate", name: "Meditate", icon: "🧘" },
    { id: "walk", name: "Walk", icon: "🚶" },
    { id: "water", name: "Water", icon: "💧" },
    { id: "read", name: "Read", icon: "📖" },
  ]

  const activity = [
    [1,2,3,2,1,0,2,1,2,3,2,1,2],
    [3,0,1,2,3,2,1,3,2,1,2,1,2],
    [2,1,1,2,3,0,0,1,2,3,2,1,2],
    [3,1,2,2,1,3,2,0,1,2,2,1,2],
    [1,2,3,0,1,1,2,3,2,1,2,1,2],
    [0,1,2,3,2,1,0,1,2,3,2,1,2],
    [1,1,2,2,3,1,2,1,2,3,2,1,2],
  ]

  return (

    <div className="p-4 space-y-6">

      <StatsHeader
        habits={habits}
        selectedHabit={selectedHabit}
        onSelectHabit={setSelectedHabit}
      />

      {selectedHabit === null ? (

        <>
          <MonthNavigation
            month="March"
            year={2026}
            onPrev={() => {}}
            onNext={() => {}}
          />

          <MonthlyProgressCalendar
            month={new Date(2026, 2)}
            data={[
              { date: "2026-03-03", progress: 80 },
              { date: "2026-03-04", progress: 50 },
              { date: "2026-03-10", progress: 100 },
            ]}
          />

          <OverallStats
            overallRate={74}
            perfectDays={9}
            bestStreak={12}
            totalEntries={86}
            activeStreaks={4}
          />

          <HabitCompletionRates
            habits={[
              { name: "Meditate", percent: 92 },
              { name: "Walk", percent: 78 },
              { name: "Water", percent: 61 },
              { name: "Read", percent: 33 },
            ]}
          />

          <StreakLeaderboard
            items={[
              { rank: 1, name: "Meditate", value: 12, label: "day streak", status: "active" },
              { rank: 2, name: "Water", value: 4, label: "day streak", status: "active" },
              { rank: 3, name: "Walk", value: 7, label: "best run", status: "risk" },
              { rank: 4, name: "Read", value: 3, label: "best run", status: "miss" },
            ]}
          />

          <TrendChart
            data={[
              { day: "Mo", meditate: 70, walk: 50, water: 40, read: 20 },
              { day: "Tu", meditate: 75, walk: 55, water: 45, read: 18 },
              { day: "We", meditate: 78, walk: 48, water: 30, read: 15 },
              { day: "Th", meditate: 80, walk: 60, water: 50, read: 25 },
              { day: "Fr", meditate: 79, walk: 55, water: 38, read: 17 },
              { day: "Sa", meditate: 77, walk: 62, water: 55, read: 22 },
              { day: "Su", meditate: 82, walk: 58, water: 44, read: 25 },
            ]}
          />

          <BestWorstDays
            habits={[
              { name: "Meditate", strongest: "Mon", weakest: "Wed" },
              { name: "Walk", strongest: "Sat", weakest: "Sun" },
              { name: "Water", strongest: "Sat", weakest: "Wed" },
              { name: "Read", strongest: "Thu", weakest: "Sun" },
            ]}
          />

          <OverallActivityHeatmap
            title="OVERALL ACTIVITY — 10 WEEKS"
            weeks={activity}
          />
        </>

      ) : (

        <StatsView
          habit={{
            streak: 12,
            completions: 86
          }}
        />

      )}

    </div>

  )

}