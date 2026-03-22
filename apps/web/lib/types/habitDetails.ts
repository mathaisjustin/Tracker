export interface HabitDetails {
  id: string
  name: string
  color: string
  unit: string
  goal: number | null
  type: "good" | "bad"

  streak: number

  todayValue: number
  progress: number

  recentEntries: {
    date: string
    value: number
    status: "complete" | "partial" | "missed" | "in_progress"
  }[]
}