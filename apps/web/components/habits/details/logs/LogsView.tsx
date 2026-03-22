"use client"

import { LogsProgressCard } from "./components/LogsProgressCard"
import { LogsInputCard } from "./components/LogsInputCard"
import { LogsHistoryCard } from "./components/LogsHistoryCard"

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
  return (
    <div className="space-y-6">

      {/* Progress card */}
      <LogsProgressCard
        title={`Daily ${habit.name} Tracker`}
        goalLabel={
          habit.target > 0
            ? `Daily goal: ${habit.target} ${
                habit.target === 1
                  ? habit.unit
                  : `${habit.unit}s`
              }`
            : ""
        }
        progress={habit.progress}
        goal={habit.target}
        streak={habit.streak}
        unit={habit.unit}
        type={habit.type}
      />

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