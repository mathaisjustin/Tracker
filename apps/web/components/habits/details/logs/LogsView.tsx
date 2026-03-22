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
  isReadOnly?: boolean
}

export function LogsView({
  habit,
  entries,
  onIncrement,
  onDecrement,
  isReadOnly = false,
}: LogsViewProps) {
  const hasGoal = habit.target > 0

  return (
    <div className="space-y-6">

      {hasGoal ? (
        <LogsProgressCard
          title={`Daily ${habit.name} Tracker`}
          goalLabel={`Daily goal: ${habit.target} ${
            habit.target === 1 ? habit.unit : `${habit.unit}s`
          }`}
          progress={habit.progress}
          goal={habit.target}
          unit={habit.unit}
        />
      ) : (
        <HabitDetailCard
          name={`Daily ${habit.name} Tracker`}
          hasGoal={false}
          unit={habit.unit ?? ""}
          todayValue={habit.progress}
          bestDay={habit.bestDay ?? habit.progress}
          avgPerDay={habit.avgPerDay ?? habit.progress}
          weeklyData={habit.weeklyData ?? [0, 0, 0, 0, 0, 0, habit.progress]}
          color={habit.color ?? "#e879a0"}
        />
      )}

      <LogsInputCard
        value={habit.progress}
        unit={habit.unit || ""}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        isReadOnly={isReadOnly}
      />

      <LogsHistoryCard entries={entries} />

    </div>
  )
}