import { supabase } from "@/lib/supabaseClient"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!

/**
 * Quick increment entry (+1) for a habit
 *
 * POST /api/entries/quick-log/increment
 * Body: { habitId, cost? }
 * Returns: { habit_id, quantity, entry_date, capped? }
 */
export async function addEntry(habitId: string, cost?: number) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token

  if (!token) {
    throw new Error("Unauthorized")
  }

  const res = await fetch(`${API_BASE_URL}/entries/quick-log/increment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      habitId,
      cost,
    }),
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result?.error || "Failed to add entry")
  }

  return result
}

