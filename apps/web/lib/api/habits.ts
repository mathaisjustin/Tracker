import type { Habit } from "@/lib/types/habits"
import type { DateStatus } from "@/lib/types/habits"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Fetch habits for a given date (stub - replace with real backend call)
 */
export async function getHabitsForDate(date: string): Promise<Habit[]> {
  // TODO: GET /habits?date={date}
  if (!API_BASE_URL) return []
  const res = await fetch(`${API_BASE_URL}/habits?date=${date}`)
  if (!res.ok) throw new Error("Failed to fetch habits")
  return res.json()
}

/**
 * Log progress for a habit (stub - replace with real backend call)
 */
export async function logProgress(
  habitId: string,
  amount: number,
  date: string
): Promise<void> {
  // TODO: POST /habits/{id}/progress
  if (!API_BASE_URL) return
  const res = await fetch(`${API_BASE_URL}/habits/${habitId}/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, date }),
  })
  if (!res.ok) throw new Error("Failed to log progress")
}

/**
 * Mark habit as complete for a date (stub - replace with real backend call)
 */
export async function completeHabit(
  habitId: string,
  date: string
): Promise<void> {
  // TODO: POST /habits/{id}/complete
  if (!API_BASE_URL) return
  const res = await fetch(`${API_BASE_URL}/habits/${habitId}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date }),
  })
  if (!res.ok) throw new Error("Failed to complete habit")
}

/**
 * Get completion status for a list of dates (stub - replace with real backend call)
 */
export async function getDateStatuses(
  dates: string[]
): Promise<DateStatus[]> {
  // TODO: GET /habits/status?dates=...
  if (!API_BASE_URL) return dates.map((d) => ({ date: d, hasActivity: false }))
  const params = new URLSearchParams({ dates: dates.join(",") })
  const res = await fetch(`${API_BASE_URL}/habits/status?${params}`)
  if (!res.ok) throw new Error("Failed to fetch date statuses")
  return res.json()
}
