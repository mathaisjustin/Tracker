import type { Habit } from "@/lib/types/habits"

export type HabitDetailTab = "log" | "stats"

export interface HabitEntry {
  id: string
  habit_id: string
  user_id: string
  quantity: number
  cost?: number | null
  note?: string | null
  created_at: string
}

export interface HabitStatsModel {
  bestStreak: number
  totalLogged: number
  perfectDays: number
  averagePerDay: number
  last7Days: Array<{ day: string; quantity: number; status: "goal" | "partial" | "missed" }>
  byWeekday: Array<{ day: string; value: number }>
  heatmap: string[][]
}

export interface HabitDetailModel {
  habit: Habit
  todayQuantity: number
  targetQuantity: number
  entries: HabitEntry[]
  stats: HabitStatsModel
}
