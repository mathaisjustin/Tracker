import { supabase } from "@/lib/supabaseClient"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface Profile {
  id: string
  onboarding_completed: boolean
}

// helper to get token
const getAuthHeader = async () => {
  const { data } = await supabase.auth.getSession()

  const token = data.session?.access_token

  if (!token) {
    throw new Error("No auth token")
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

/**
 * Fetch user profile
 */
export const getProfile = async (): Promise<Profile> => {

  const headers = await getAuthHeader()

  const res = await fetch(`${API_BASE_URL}/profile`, {
    headers,
  })

  if (!res.ok) {
    throw new Error("Failed to fetch profile")
  }

  return res.json()
}

/**
 * Complete onboarding
 */
export const completeOnboarding = async () => {

  const headers = await getAuthHeader()

  const res = await fetch(`${API_BASE_URL}/profile/onboarding`, {
    method: "PATCH",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    throw new Error("Failed to complete onboarding")
  }

  return res.json()
}