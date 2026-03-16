import type { Habit } from "@/lib/types/habits"
import type { DateStatus } from "@/lib/types/habits"
import type { HabitEntry } from "@/lib/types/habits"

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
  daily_limit?: number | null
  created_at: string
  archived_at: string | null
  selected_day_quantity?: number
  target_quantity?: number
  selected_day_completed?: boolean
}

function parseTargetValue(target: string): number {
  const normalized = target.trim().toLowerCase()

  if (normalized === "10k") return 10000

  const kMatch = normalized.match(/^(\d+(?:\.\d+)?)k$/)
  if (kMatch) return Math.max(1, Math.round(Number(kMatch[1]) * 1000))

  const mMatch = normalized.match(/^(\d+(?:\.\d+)?)m$/)
  if (mMatch) return Math.max(1, Math.round(Number(mMatch[1])))

  const numeric = Number(normalized)
  if (!Number.isNaN(numeric) && Number.isFinite(numeric) && numeric > 0) {
    return Math.round(numeric)
  }

  return 1
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
  const target = backend.unit === "steps" ? "10k" : (backend.daily_limit ? String(backend.daily_limit) : backend.unit || "1")
  const targetUnit = backend.unit === "steps" ? "steps" : backend.unit === "glasses" ? "glasses" : backend.unit || "minutes"
  const current = Math.max(0, Number(backend.selected_day_quantity ?? 0))
  const fallbackCompleted = current >= parseTargetValue(target)

  return {
    id: backend.id,
    name: backend.name,
    icon,
    target,
    targetUnit,
    current,
    completed: backend.selected_day_completed ?? fallbackCompleted,
    streak: 0,
    streakType: "streak",
    color: backend.color,
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
