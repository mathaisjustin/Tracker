import { supabase } from "../db/supabase"

export const createHabitService = async (
  user_id: string,
  name: string,
  color: string,
  type: string,
  unit: string,
  base_cost: number,
  daily_limit?: number,
  created_at?: string
) => {

  /* -------------------------------- */
  /* 1️⃣ Get user profile */
  /* -------------------------------- */

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("id", user_id)
    .maybeSingle()

  if (profileError) {
    throw new Error(profileError.message)
  }

  if (!profile) {
    throw new Error("User profile not found")
  }

  /* -------------------------------- */
  /* 2️⃣ If NOT pro → enforce limit */
  /* -------------------------------- */

  if (!profile.is_pro) {

    const { count, error: countError } = await supabase
      .from("habits")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user_id)
      .eq("is_archived", false)

    if (countError) {
      throw new Error(countError.message)
    }

    if ((count ?? 0) >= 2) {
      throw new Error(
        "Free users can only create up to 2 habits. Upgrade to Pro for unlimited habits."
      )
    }
  }

  /* -------------------------------- */
  /* 3️⃣ Insert habit */
  /* -------------------------------- */

  const { data, error } = await supabase
    .from("habits")
    .insert({
      user_id,
      name,
      color,
      type,
      unit,
      base_cost,
      daily_limit: daily_limit ?? null,
      created_at: created_at ?? undefined
    })
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data
}