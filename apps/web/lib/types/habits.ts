export type FilterTab = "all" | "active" | "done"

export interface Habit {
  id: string
  name: string
  icon: string // e.g. "walk" | "water" | "read" | "meditate"
  target: string // e.g. "10k", "8", "30m"
  targetUnit: string // e.g. "steps", "glasses", "minutes"
  current: number
  completed: boolean
  streak: number // positive = streak, negative = miss
  streakType: "streak" | "miss"
}

export interface DateStatus {
  date: string // ISO date
  hasActivity: boolean
}
