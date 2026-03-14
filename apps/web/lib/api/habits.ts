import type { Habit } from "@/lib/types/habits"
import type { DateStatus } from "@/lib/types/habits"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

/** Backend habit shape from GET /habits/:user_id */
export interface BackendHabit {
  id: string
  user_id: string
  name: string
  color: string
  type: string
  unit: string
  base_cost: number
  created_at: string
  archived_at: string | null
}

function mapBackendToHabit(backend: BackendHabit): Habit {
  const iconMap: Record<string, string> = {
    steps: "walk",
    water: "water",
    glasses: "water",
    minutes: "read",
    sessions: "meditate",
  }
  const icon = iconMap[backend.type?.toLowerCase()] ?? iconMap[backend.unit?.toLowerCase()] ?? "read"
  const target = backend.unit === "steps" ? "10k" : backend.unit || "1"
  const targetUnit = backend.unit === "steps" ? "steps" : backend.unit === "glasses" ? "glasses" : backend.unit || "minutes"

  return {
    id: backend.id,
    name: backend.name,
    icon,
    target,
    targetUnit,
    current: 0,
    completed: false,
    streak: 0,
    streakType: "streak",
  }
}

/**
 * Fetch habits for a user and date.
 * GET /habits/:user_id?date=YYYY-MM-DD
 */
export async function getHabits(userId: string, date: string): Promise<Habit[]> {
  if (!API_BASE_URL) return []
  const res = await fetch(`${API_BASE_URL}/habits/${userId}?date=${encodeURIComponent(date)}`)
  if (!res.ok) throw new Error("Failed to fetch habits")
  const data: BackendHabit[] = await res.json()
  return data.map(mapBackendToHabit)
}

/**
 * Log progress for a habit (stub - wire to entries API later)
 */
export async function logProgress(
  _habitId: string,
  _amount: number,
  _date: string
): Promise<void> {
  // TODO: POST /entries with habit_id, user_id, quantity
}

/**
 * Mark habit as complete (stub - wire when backend supports)
 */
export async function completeHabit(_habitId: string, _date: string): Promise<void> {
  // TODO
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
  }
): Promise<BackendHabit> {
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
 * Get completion status for dates (stub - wire when backend supports)
 */
export async function getDateStatuses(dates: string[]): Promise<DateStatus[]> {
  return dates.map((date) => ({ date, hasActivity: false }))
}
