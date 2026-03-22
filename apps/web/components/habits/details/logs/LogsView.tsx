"use client"

import { LogsProgressCard } from "./components/LogsProgressCard"
import { LogsInputCard } from "./components/LogsInputCard"
import { LogsHistoryCard } from "./components/LogsHistoryCard"
import { HabitDetailCard } from "./components/HabitDetailCard"

type EntryStatus = "complete" | "partial" | "missed" | "progress"

type LogEntry = {
  date: string
  value: number
  unit?: string
  status: EntryStatus
}

type LogsViewProps = {
  habit: {
    name: string
    target: number
    progress: number
    completedToday: boolean
    unit?: string
    streak: number
    type: "good" | "bad"
    bestDay?: number
    avgPerDay?: number
    weeklyData?: number[]
    color?: string
  }
  entries: LogEntry[]
  onIncrement: () => void
  onDecrement: () => void
}

export function LogsView({
  habit,
  entries,
  onIncrement,
  onDecrement,
}: LogsViewProps) {
  const hasGoal = habit.target > 0

  // Keep today (last index) in sync with current progress
  const weeklyData = habit.weeklyData
    ? [...habit.weeklyData.slice(0, 6), habit.progress]
    : Array(7).fill(0).map((_, i) => i === 6 ? habit.progress : 0)

  return (
    <div className="space-y-6">

      {/* Progress card — swaps based on whether habit has a goal */}
      {hasGoal ? (
        <LogsProgressCard
          title={`Daily ${habit.name} Tracker`}
          goalLabel={`Daily goal: ${habit.target} ${
            habit.target === 1 ? habit.unit : `${habit.unit}s`
          }`}
          progress={habit.progress}
          goal={habit.target}
          streak={habit.streak}
          unit={habit.unit}
          type={habit.type}
        />
      ) : (
        <HabitDetailCard
          name={`Daily ${habit.name} Tracker`}
          hasGoal={false}
          unit={habit.unit ?? ""}
          todayValue={habit.progress}
          bestDay={habit.bestDay ?? habit.progress}
          avgPerDay={habit.avgPerDay ?? habit.progress}
          weeklyData={weeklyData}
          streak={habit.streak}
          color={habit.color ?? "#e879a0"}
        />
      )}

      {/* Input */}
      <LogsInputCard
        value={habit.progress}
        unit={habit.unit || ""}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />

      {/* History */}
      <LogsHistoryCard entries={entries} />

    </div>
  )
}