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

  // these 3 are new
  bestDay: number
  avgPerDay: number
  weeklyData: number[]

  recentEntries: {
    date: string
    value: number
    status: "complete" | "partial" | "missed" | "in_progress"
  }[]
}