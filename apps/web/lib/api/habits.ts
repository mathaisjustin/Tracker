import type { Habit } from "@/lib/types/habits"
import type { HabitDetails } from "@/lib/types/habitDetails"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface BackendHabit {
  id: string
  name: string
  color: string
  type: "good" | "bad"
  unit: string | null
  target: number | null
  current: number
  has_entry: boolean
  base_cost: number | null
}

export interface GetHabitsResponse {
  habits: BackendHabit[]
  day_progress: number
}

function mapBackendToHabit(backend: BackendHabit): Habit {
  return {
    id: backend.id,
    name: backend.name,
    type: backend.type,
    icon: "read",
    target: backend.target,
    targetUnit: backend.unit ?? "",
    current: backend.current,
    completed: backend.target !== null
      ? backend.current >= backend.target
      : backend.has_entry,
    streak: 0,
    streakType: "streak",
    color: backend.color,
    baseCost: backend.base_cost,
  }
}

export interface WeekStatus {
  date: string
  day_progress: number
}

export interface GetHabitsResponse {
  habits: BackendHabit[]
  day_progress: number
  week_statuses: WeekStatus[]
}

export async function getHabits(
  token: string,
  date?: string,
  weekRange?: { start: string; end: string }
): Promise<{ habits: Habit[]; dayProgress: number; weekStatuses: WeekStatus[] }> {
  if (!API_BASE_URL) throw new Error("API URL not configured")

  const params = new URLSearchParams()
  if (date) params.set("date", date)
  if (weekRange) {
    params.set("start", weekRange.start)
    params.set("end", weekRange.end)
  }

  const res = await fetch(`${API_BASE_URL}/habits?${params.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    let message = "Failed to fetch habits"
    try {
      const data = await res.json()
      message = data?.error ?? message
    } catch {}
    throw new Error(message)
  }

  const data: GetHabitsResponse = await res.json()

  return {
    habits: data.habits.map(mapBackendToHabit),
    dayProgress: data.day_progress,
    weekStatuses: data.week_statuses,
  }
}

/**
 * CREATE HABIT
 * POST /api/habits
 */
export async function createHabit(
  token: string,
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
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to create habit")
  }

  return data
}

/**
 * ARCHIVE HABIT
 * PATCH /api/habits/:id/archive
 */
export async function archiveHabit(token: string, habitId: string): Promise<void> {
  if (!API_BASE_URL) throw new Error("API URL not configured")

  const res = await fetch(`${API_BASE_URL}/habits/${habitId}/archive`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    let message = "Failed to archive habit"
    try {
      const data = await res.json()
      message = data?.error ?? message
    } catch {}
    throw new Error(message)
  }
}

/**
 * UPDATE HABIT
 * PUT /api/habits/:id
 */
export async function updateHabit(
  token: string,
  habitId: string,
  payload: {
    name?: string
    color?: string
    type?: "good" | "bad"
    unit?: string
    base_cost?: number
    daily_limit?: number
  }
): Promise<BackendHabit> {
  if (!API_BASE_URL) throw new Error("API URL not configured")

  const res = await fetch(`${API_BASE_URL}/habits/${habitId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to update habit")
  }

  return data
}

/**
 * GET HABIT DETAILS
 * GET /api/habits/:id/details
 */
export async function getHabitDetails(
  token: string,
  habitId: string
): Promise<HabitDetails> {
  if (!API_BASE_URL) throw new Error("API URL not configured")

  const res = await fetch(`${API_BASE_URL}/habits/${habitId}/details`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    let message = "Failed to fetch habit details"
    try {
      const data = await res.json()
      message = data?.error ?? message
    } catch {}
    throw new Error(message)
  }

  return res.json() as Promise<HabitDetails>
}

/**
 * LOG HABIT ENTRY
 * POST /api/habits/:id/details/log
 */
export async function logHabitEntry(
  token: string,
  habitId: string,
  action: "increment" | "decrement"
): Promise<{ quantity: number }> {
  if (!API_BASE_URL) throw new Error("API URL not configured")

  const res = await fetch(`${API_BASE_URL}/habits/${habitId}/details/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action }),
  })

  if (!res.ok) {
    let message = "Failed to log entry"
    try {
      const data = await res.json()
      message = data?.error ?? message
    } catch {}
    throw new Error(message)
  }

  return res.json() as Promise<{ quantity: number }>
}