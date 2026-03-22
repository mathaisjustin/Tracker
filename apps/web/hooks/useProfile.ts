"use client"

import { useEffect, useState } from "react"
import { getProfile, type Profile } from "@/lib/api/profile"
import { useAuth } from "@/lib/AuthProvider"

export function useProfile() {
  const { session } = useAuth()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!session?.access_token) return

    let cancelled = false

    async function fetchProfile() {
      setIsLoading(true)

      try {
        const data = await getProfile()
        if (!cancelled) setProfile(data)
      } catch (err) {
        console.error("Profile fetch failed:", err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchProfile()

    return () => { cancelled = true }
  }, [session?.access_token])

  const isPro = profile?.is_pro ?? false
  const activeHabitCount = profile?.active_habit_count ?? 0
  const canCreate = isPro || activeHabitCount < 2  // ← computed here

  return {
    profile,
    isPro,
    canCreate,  // ← exposed
    isLoading,
  }
}