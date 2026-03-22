import type { Habit } from "@/lib/types/habits"
import type { HabitDetails } from "@/lib/types/habitDetails"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Backend Habit Shape (EXACT response from GET /api/habits)
 */
export interface BackendHabit {
  id: string
  name: string
  color: string
  type: "good" | "bad"
  unit: string | null
  created_at: string
  is_archived: boolean
  daily_limit: number | null

  // computed by backend
  selected_day_quantity: number
  target_quantity: number
  is_completed: boolean
}

export interface BackendHabitDetails {
  habit: {
    id: string
    name: string
    color: string
    unit: string | null
    goal: number | null
    type: "good" | "bad"
  }

  streak: {
    current: number
  }

  today: {
    value: number
    goal: number | null
    progress: number
  }

  recent_entries: {
    date: string
    value: number
    status: "complete" | "partial" | "missed" | "in_progress"
  }[]
}

/**
 * Map backend habit → frontend habit
 * (UI-friendly shape)
 */
function mapBackendToHabit(backend: BackendHabit): Habit {
  console.log("BACKEND:", backend.name, {
    daily_limit: backend.daily_limit,
    target_quantity: backend.target_quantity,
  })

  const mapped: Habit = {
    id: backend.id,
    name: backend.name,
    icon: "read",
    target: backend.target_quantity ?? null,
    targetUnit: backend.unit ?? "",
    current: backend.selected_day_quantity,
    completed: backend.is_completed,
    streak: 0,
    streakType: "streak", // ✅ works now because of typing
    color: backend.color,
  }

  console.log("MAPPED:", backend.name, {
    target: mapped.target,
  })

  return mapped
}

function mapBackendToHabitDetails(data: BackendHabitDetails): HabitDetails {
  return {
    id: data.habit.id,
    name: data.habit.name,
    color: data.habit.color,
    unit: data.habit.unit ?? "",
    goal: data.habit.goal,
    type: data.habit.type,

    streak: data.streak?.current ?? 0,

    todayValue: data.today.value,
    progress: data.today.progress,

    recentEntries: data.recent_entries
  }
}

/**
 * GET HABITS
 *
 * - Uses Supabase JWT (Authorization header)
 * - Backend resolves user automatically
 * - NO userId in URL
 */
export async function getHabits(token: string): Promise<Habit[]> {
  if (!API_BASE_URL) throw new Error("API URL not configured")

  const res = await fetch(`${API_BASE_URL}/habits`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    let message = "Failed to fetch habits"
    try {
      const data = await res.json()
      message = data?.error ?? message
    } catch {}
    throw new Error(message)
  }

  const data: BackendHabit[] = await res.json()

  return data.map(mapBackendToHabit)
}

/**
 * CREATE HABIT
 *
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
) {
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

  return data.habit
}

/**
 * GET HABIT DETAILS
 *
 * GET /api/habits/:id/details
 */

export async function getHabitDetails(
  token: string,
  habitId: string
): Promise<HabitDetails> {
  if (!API_BASE_URL) throw new Error("API URL not configured")

  const res = await fetch(`${API_BASE_URL}/habits/${habitId}/details`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    let message = "Failed to fetch habit details"
    try {
      const data = await res.json()
      message = data?.error ?? message
    } catch {}
    throw new Error(message)
  }

  const data: BackendHabitDetails = await res.json()

  return mapBackendToHabitDetails(data)
}

/**
 * ARCHIVE HABIT
 *
 * PATCH /api/habits/archive/:id
 */
export async function archiveHabit(
  token: string,
  habitId: string
): Promise<void> {
  if (!API_BASE_URL) throw new Error("API URL not configured")

  const res = await fetch(`${API_BASE_URL}/habits/archive/${habitId}`, {
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