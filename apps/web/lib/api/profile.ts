import { supabase } from "@/lib/supabaseClient"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface Profile {
  id: string
  onboarding_completed: boolean
}

/**
 * Fetch user profile
 */
export const getProfile = async (userId: string): Promise<Profile> => {

  const res = await fetch(`${API_BASE_URL}/profile/${userId}`)

  if (!res.ok) {
    throw new Error("Failed to fetch profile")
  }

  return res.json()
}

/**
 * Complete onboarding
 */
export const completeOnboarding = async (userId: string) => {

  const res = await fetch(`${API_BASE_URL}/profile/onboarding`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: userId
    })
  })

  if (!res.ok) {
    throw new Error("Failed to complete onboarding")
  }

  return res.json()
}