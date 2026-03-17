import { supabase } from "@/lib/supabaseClient"

const API_BASE_URL = "/api"

console.log("API BASE URL:", API_BASE_URL)

export interface Profile {
  id: string
  onboarding_completed: boolean
}

// helper to get token
const getAuthHeader = async (): Promise<Record<string, string>> => {
  const { data } = await supabase.auth.getSession()

  const token = data.session?.access_token

  console.log("TOKEN:", token)

  if (!token) {
    console.warn("No auth token yet")
    return {} // ✅ now typed correctly
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
    const text = await res.text()
    console.error("PROFILE ERROR:", text)
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