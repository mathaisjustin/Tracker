import { supabase } from "@/lib/supabaseClient"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!

/**
 * Add habit entry (+1)
 */
export async function addEntry(habitId: string) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  if (!token) {
    throw new Error("Unauthorized")
  }

  const res = await fetch(`${API_BASE_URL}/entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      habit_id: habitId,
    }),
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result?.error || "Failed to add entry")
  }

  return result.entry
}

/**
 * Log habit entry (+ / -)
 *
 * Uses:
 * POST /entries/:habitId/log
 */
export async function logHabitEntry(
  habitId: string,
  action: "increment" | "decrement",
  value: number = 1
) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  if (!token) {
    throw new Error("Unauthorized")
  }

  const res = await fetch(`${API_BASE_URL}/entries/${habitId}/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      action,
      value,
    }),
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result?.error || "Failed to log entry")
  }

  return result.entry
}

