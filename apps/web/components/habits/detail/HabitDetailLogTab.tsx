import { format } from "date-fns"

import type { Habit } from "@/lib/types/habits"
import type { HabitEntry } from "./types"

interface HabitDetailLogTabProps {
  habit: Habit
  entries: HabitEntry[]
  todayQuantity: number
  targetQuantity: number
}

function statusForEntry(quantity: number, target: number): { label: string; tone: string } {
  if (quantity >= target) {
    return { label: "Complete", tone: "bg-emerald-500/15 text-emerald-400" }
  }
  if (quantity > 0) {
    return { label: "Partial", tone: "bg-amber-500/15 text-amber-400" }
  }
  return { label: "Missed", tone: "bg-rose-500/15 text-rose-400" }
}

export function HabitDetailLogTab({ habit, entries, todayQuantity, targetQuantity }: HabitDetailLogTabProps) {
  const completion = Math.max(0, Math.min(100, Math.round((todayQuantity / Math.max(1, targetQuantity)) * 100)))
  const targetLabel = habit.targetUnit === "steps" ? `${habit.target} steps` : `${habit.target} ${habit.targetUnit}`

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-white">Daily {habit.name} Intake</p>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">4 day streak</span>
        </div>
        <p className="mt-1 text-xs text-zinc-400">Goal: {targetLabel}</p>
        <div className="mt-3 h-2 rounded-full bg-zinc-800">
          <div className="h-2 rounded-full bg-white" style={{ width: `${completion}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
          <span>{todayQuantity} today</span>
          <span>{targetQuantity} goal</span>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Recent Entries</p>
        <div className="mt-3 space-y-3">
          {entries.length === 0 ? (
            <p className="text-sm text-zinc-400">No entries yet.</p>
          ) : (
            entries.slice(0, 6).map((entry) => {
              const status = statusForEntry(entry.quantity, targetQuantity)
              return (
                <div key={entry.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-zinc-900 pb-2 last:border-0">
                  <span className="text-sm text-zinc-300">{format(new Date(entry.created_at), "EEE, MMM d")}</span>
                  <span className="text-sm font-semibold text-white">{entry.quantity} {habit.targetUnit}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${status.tone}`}>{status.label}</span>
                </div>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}
