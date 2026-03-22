"use client"

import { useMemo } from "react"

const DAYS = ["M", "T", "W", "T", "F", "S", "S"]

interface HabitDetailCardProps {
  name: string
  hasGoal: boolean
  goal?: number
  unit: string
  todayValue: number
  bestDay: number
  avgPerDay: number
  weeklyData: number[] // 7 values, index 6 = today
  streak?: number
  color?: string
}

export function HabitDetailCard({
  name,
  hasGoal,
  goal,
  unit,
  todayValue,
  bestDay,
  avgPerDay,
  weeklyData,
  streak,
  color = "#e879a0",
}: HabitDetailCardProps) {
  const circumference = 2 * Math.PI * 36

  const progressPercent = useMemo(() => {
    if (hasGoal && goal) return Math.min((todayValue / goal) * 100, 100)
    if (bestDay === 0) return 0
    return Math.min((todayValue / bestDay) * 100, 100)
  }, [todayValue, goal, hasGoal, bestDay])

  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  const maxBar = useMemo(() => Math.max(...weeklyData, 1), [weeklyData])
  const weekTotal = weeklyData.reduce((a, b) => a + b, 0)

  // Dynamic stat line
  const statLine = useMemo(() => {
    if (hasGoal && goal) {
      if (todayValue === 0) return { text: `0 of ${goal} ${unit} logged`, variant: "neutral" }
      if (todayValue >= goal) return { text: "✓ Goal complete!", variant: "best" }
      return { text: `${goal - todayValue} ${unit} remaining`, variant: "neutral" }
    }
    // No-goal path
    if (todayValue === 0) return { text: "No entries yet today", variant: "neutral" }
    if (bestDay > 0 && todayValue >= bestDay) return { text: "★ New personal best!", variant: "best" }
    if (avgPerDay > 0 && todayValue > avgPerDay) {
      const pct = Math.round(((todayValue - avgPerDay) / avgPerDay) * 100)
      return { text: `↑ ${pct}% above your avg`, variant: "above" }
    }
    if (avgPerDay > 0 && Math.round(todayValue) === Math.round(avgPerDay)) {
      return { text: "Right at your avg", variant: "neutral" }
    }
    if (avgPerDay > 0 && todayValue < avgPerDay) {
      const pct = Math.round(((avgPerDay - todayValue) / avgPerDay) * 100)
      return { text: `↓ ${pct}% below your avg`, variant: "below" }
    }
    return { text: "Keep going!", variant: "neutral" }
  }, [todayValue, bestDay, avgPerDay, hasGoal, goal, unit])

  const statLineStyle: Record<string, { bg: string; color: string }> = {
    best:    { bg: `${color}25`, color },
    above:   { bg: `${color}15`, color },
    neutral: { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" },
    below:   { bg: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" },
  }
  const activeStyle = statLineStyle[statLine.variant]

  return (
    <div
      className="rounded-2xl p-5 w-full"
      style={{ backgroundColor: "#111113", border: "1px solid rgba(255,255,255,0.07)" }}
    >

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-white font-bold text-base leading-snug">{name}</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
            {hasGoal ? `Goal · ${goal} ${unit}` : "No goal · open-ended"}
          </p>
        </div>

        {/* Streak badge — optional */}
        {streak !== undefined && streak > 0 && (
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <span style={{ fontSize: 14 }}>🔥</span>
            <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>
              {streak} day streak
            </span>
          </div>
        )}
      </div>

      {/* ── Body: ring + stats ── */}
      <div className="flex items-start gap-5 mb-5">

        {/* Ring */}
        <div className="relative shrink-0 flex items-center justify-center" style={{ width: 84, height: 84 }}>
          <svg width="84" height="84" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="42" cy="42" r="36"
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="5.5"
            />
            <circle
              cx="42" cy="42" r="36"
              fill="none"
              stroke={color}
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-bold text-white" style={{ fontSize: 22, lineHeight: 1 }}>
              {todayValue}
            </span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>
              today
            </span>
          </div>
        </div>

        {/* Stats column */}
        <div className="flex-1 min-w-0 flex flex-col gap-2.5">

          {/* Best day */}
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Best day</span>
            <span style={{ fontSize: 13, fontWeight: 700, color }}>{bestDay}</span>
          </div>

          {/* Avg / day */}
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Avg / day</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
              {avgPerDay.toFixed(1)}
            </span>
          </div>

          {/* Dynamic stat line — full width pill */}
          <div
            className="w-full rounded-xl px-3 py-2"
            style={{
              backgroundColor: activeStyle.bg,
              transition: "background-color 0.3s ease",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: activeStyle.color,
                transition: "color 0.3s ease",
              }}
            >
              {statLine.text}
            </span>
          </div>

        </div>
      </div>

      {/* ── 7-day bars ── */}
      <div>
        <div className="flex items-end gap-1" style={{ height: 44 }}>
          {weeklyData.map((val, i) => {
            const heightPct = (val / maxBar) * 100
            const isToday = i === weeklyData.length - 1
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div
                  className="w-full rounded-[4px]"
                  style={{
                    height: `${Math.max(heightPct, val > 0 ? 10 : 4)}%`,
                    backgroundColor: isToday ? color : `${color}44`,
                    transition: "height 0.3s ease",
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    color: isToday ? color : "rgba(255,255,255,0.3)",
                  }}
                >
                  {DAYS[i]}
                </span>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div
          className="flex justify-between mt-2"
          style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}
        >
          <span>7 days</span>
          <span>{weekTotal} total this week</span>
        </div>
      </div>

    </div>
  )
}