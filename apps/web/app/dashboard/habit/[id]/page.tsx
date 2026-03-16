"use client"

import { useMemo } from "react"
import { useParams, useSearchParams } from "next/navigation"

import { HabitDetailShell } from "@/components/habits/detail"
import { useHabitDetail } from "@/hooks/useHabitDetail"

export default function HabitPage() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const habitId = params.id
  const { detail, isLoading, activeTab, setActiveTab } = useHabitDetail(habitId)

  const backHref = useMemo(() => {
    const selectedDate = searchParams.get("date")
    if (!selectedDate) return "/dashboard/habits"
    return `/dashboard/habits?date=${encodeURIComponent(selectedDate)}`
  }, [searchParams])

  if (isLoading) {
    return <p className="text-sm text-zinc-400">Loading habit details...</p>
  }

  if (!detail) {
    return <p className="text-sm text-zinc-400">Habit details not found.</p>
  }

  return (
    <HabitDetailShell
      detail={detail}
      activeTab={activeTab}
      onChangeTab={setActiveTab}
      backHref={backHref}
    />
  )
}