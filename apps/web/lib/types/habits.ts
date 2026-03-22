export type FilterTab = "all" | "active" | "done"

export interface Habit {
  id: string
  name: string
  icon: string // e.g. "walk" | "water" | "read" | "meditate"
  target: number | null // e.g. "10k", "8", "30m"
  targetUnit: string // e.g. "steps", "glasses", "minutes"
  current: number
  completed: boolean
  streak: number // positive = streak, negative = miss
  streakType: "streak" | "miss"
  color: string // hex color from backend
}

export interface DateStatus {
  date: string
  hasActivity: boolean
  completionRate: number
  trackedHabits: number
  totalHabits: number
}