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
  color: string // hex color from backend
}

export interface DateStatus {
  date: string // ISO date
  hasActivity: boolean
  completionRate: number // 0..1 based on tracked habits / active habits
  trackedHabits: number
  totalHabits: number
}

export interface HabitEntry {
  id: string
  habit_id: string
  user_id: string
  quantity: number
  cost?: number | null
  note?: string | null
  created_at: string
}
