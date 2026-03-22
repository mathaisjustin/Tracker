import type { Habit } from "@/lib/types/habits"
import type { DateStatus } from "@/lib/types/habits"
import type { HabitEntry } from "@/lib/types/habits"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Fetch habits for a user and date.
 * GET /habits/:user_id?date=YYYY-MM-DD
 */
export async function getHabits(userId: string, date: string): Promise<Habit[]> {
  if (!API_BASE_URL) return []
  const res = await fetch(`${API_BASE_URL}/habits/${userId}?date=${encodeURIComponent(date)}`)
  if (!res.ok) throw new Error("Failed to fetch habits")
  return res.json()
}

/**
 * Log progress for a habit (stub - wire to entries API later)
 */
export async function logProgress(
  userId: string,
  habitId: string,
  amount: number,
  date: string
): Promise<void> {
  if (!API_BASE_URL) throw new Error("API URL not configured")

  const res = await fetch(`${API_BASE_URL}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      habit_id: habitId,
      user_id: userId,
      quantity: amount,
    }),
  })

  if (!res.ok) {
    let message = "Failed to log progress"
    try {
      const data = await res.json()
      message = data?.error?.message ?? data?.error ?? message
    } catch (_err) {
      /* ignore parse error */
    }
    throw new Error(message)
  }
}

/**
 * Mark habit as complete (stub - wire when backend supports)
 */
export async function completeHabit(_habitId: string, _date: string): Promise<void> {
  // TODO
}

/**
 * Archive a habit
 * PATCH /habits/archive/:id
 */
export async function archiveHabit(habitId: string): Promise<void> {
  if (!API_BASE_URL) throw new Error("API URL not configured")
  const res = await fetch(`${API_BASE_URL}/habits/archive/${habitId}`, {
    method: "PATCH",
  })

  if (!res.ok) {
    let message = "Failed to archive habit"
    try {
      const data = await res.json()
      message = data?.error ?? message
    } catch (_err) {
      /* ignore parse error */
    }
    throw new Error(message)
  }
}

/**
 * Create a new habit.
 * POST /api/habits
 */
export async function createHabit(
  userId: string,
  payload: {
    name: string
    color: string
    type: "good" | "bad"
    unit: string
    base_cost?: number
    daily_limit?: number
    created_at?: string
  }
): Promise<Habit> {
  if (!API_BASE_URL) throw new Error("API URL not configured")
  const res = await fetch(`${API_BASE_URL}/habits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, ...payload }),
  })
  const data = await res.json()
  if (!res.ok)
    throw new Error(data?.error?.message ?? "Failed to create habit")
  return Array.isArray(data) ? data[0] : data
}

/**
 * Get completion status for a date range
 * GET /habits/status/:user_id?start=YYYY-MM-DD&end=YYYY-MM-DD
 */
export async function getDateStatuses(
  userId: string,
  startDate: string,
  endDate: string
): Promise<DateStatus[]> {
  if (!API_BASE_URL) return []

  const qs = new URLSearchParams({ start: startDate, end: endDate })
  const res = await fetch(`${API_BASE_URL}/habits/status/${userId}?${qs.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch date statuses")

  const data = (await res.json()) as DateStatus[]
  return data
}

/**
 * Fetch entries for a single habit.
 * GET /entries/:habit_id
 */
export async function getHabitEntries(habitId: string): Promise<HabitEntry[]> {
  if (!API_BASE_URL) return []
  const res = await fetch(`${API_BASE_URL}/entries/${habitId}`)
  if (!res.ok) throw new Error("Failed to fetch habit entries")

  const data = (await res.json()) as HabitEntry[]
  return data
}
