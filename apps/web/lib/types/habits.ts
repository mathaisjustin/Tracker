export type FilterTab = "all" | "active" | "done"

export interface Habit {
  id: string
  name: string
  type: "good" | "bad"
  icon: string
  target: number | null
  targetUnit: string
  current: number
  completed: boolean
  streak: number
  streakType: "streak" | "miss"
  color: string
  baseCost: number | null
}

export interface DateStatus {
  date: string
  hasActivity: boolean
  completionRate: number
  trackedHabits: number
  totalHabits: number
}