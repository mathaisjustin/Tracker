"use client"

import { format } from "date-fns"
import { useHabitStats } from "@/hooks/useHabitStats"
import StatsOverviewCards from "./components/StatsOverviewCards"
import MonthlyProgressCalendar from "./components/MonthlyProgressCalendar"
import MomentumScore from "./components/Momentumscore"
import ActivityHeatmap from "./components/ActivityHeatmap"

type StatsViewProps = {
  habitId: string
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function StatsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Overview cards */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 h-24" />
        ))}
      </div>
      {/* Calendar */}
      <div className="bg-zinc-900 rounded-xl p-4 h-64" />
      {/* Momentum */}
      <div className="bg-zinc-900 rounded-xl p-4 h-36" />
      {/* Heatmap */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 h-24" />
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function StatsView({ habitId }: StatsViewProps) {
  const { stats, isLoading } = useHabitStats(habitId)

  if (isLoading) return <StatsSkeleton />
  if (!stats) return <p className="text-zinc-500 text-sm p-4">Failed to load stats.</p>

  const { summary, calendar, momentum, heatmap } = stats

  // ─── Card 1: Overview stats ──────────────────────────────────────────────────

  const bestDayFormatted = summary.bestDay.date
    ? format(new Date(summary.bestDay.date + "T00:00:00"), "MMM d")
    : "—"

  const overviewStats = [
    {
      label: "Best Day",
      value: summary.bestDay.value,
      sub: bestDayFormatted,
    },
    {
      label: "Completion",
      value: `${summary.completionRate.thisMonth}%`,
      sub: "this month",
      // we store thisYear too — can be used for a tap-to-toggle later
    },
    {
      label: "Total Entries",
      value: summary.totalEntries,
      sub: "days logged",
    },
    summary.goalStat.type === "perfectDays"
      ? {
          label: "Perfect Days",
          value: summary.goalStat.value,
          sub: "goal reached",
        }
      : {
          label: "Longest Streak",
          value: summary.goalStat.value,
          sub: "days in a row",
        },
  ]

  // ─── Card 2: Calendar — map API days to { date, progress: 0–100 } ───────────

  const calendarData = calendar.days.map((d) => ({
    date: d.date,
    progress: Math.round(d.progress * 100), // API gives 0.0–1.0, calendar expects 0–100
  }))

  // ─── Card 3: Momentum — map weeklyPoints to { date, progress } ───────────────

  const momentumData = momentum.weeklyPoints.map((w) => ({
    date: w.weekOf,
    progress: w.score,
  }))

  // ─── Card 4: Heatmap — map API weeks to number[][] ──────────────────────────

  const heatmapWeeks = heatmap.map((week) =>
    week.days.map((d) => d.intensity)
  )

  return (
    <div className="space-y-6">

      <StatsOverviewCards stats={overviewStats} />

      <MonthlyProgressCalendar data={calendarData} />

      <MomentumScore data={momentumData} />

      <ActivityHeatmap
        title="Activity — Last 10 Weeks"
        weeks={heatmapWeeks}
      />

    </div>
  )
}