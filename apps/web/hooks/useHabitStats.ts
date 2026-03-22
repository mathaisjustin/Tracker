"use client"

import { useEffect, useState } from "react"
import { getHabitStats, HabitStats } from "@/lib/api/habits"
import { useAuth } from "@/lib/AuthProvider"

type UseHabitStatsResult = {
  stats: HabitStats | null
  isLoading: boolean
}

export function useHabitStats(habitId: string): UseHabitStatsResult {
  const { session, loading } = useAuth()

  const [stats, setStats] = useState<HabitStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      if (loading) return
      if (!session || !habitId) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        const data = await getHabitStats(session.access_token, habitId)
        if (!cancelled) setStats(data)
      } catch (err) {
        console.error("Failed to fetch habit stats:", err)
        if (!cancelled) setStats(null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchData()

    return () => { cancelled = true }
  }, [session, loading, habitId])

  return { stats, isLoading }
}