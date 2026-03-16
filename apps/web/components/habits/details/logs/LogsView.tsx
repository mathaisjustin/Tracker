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
  }
  entries: LogEntry[]
}

export function LogsView({ habit, entries }: LogsViewProps) {
  return (
    <div className="space-y-6">

      {/* Progress card */}
      <LogsProgressCard
        title="Daily Water Intake"
        goalLabel={`Goal: ${habit.target} cups per day`}
        progress={habit.progress}
        goal={habit.target}
        streak={4}
      />

      {/* Input */}
      <LogsInputCard
        value={habit.progress}
        unit="cups"
        onIncrement={() => console.log("increment")}
        onDecrement={() => console.log("decrement")}
      />

      {/* History */}
      <LogsHistoryCard entries={entries} />

    </div>
  )
}