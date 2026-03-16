"use client"

import { useEffect, useMemo } from "react"
import { format, parseISO, isValid } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"
import { HabitsPageShell } from "@/components/habits"
import { useHabits } from "@/hooks/useHabits"

export default function HabitsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialDate = useMemo(() => {
    const raw = searchParams.get("date")
    if (!raw) return new Date()
    const parsed = parseISO(raw)
    return isValid(parsed) ? parsed : new Date()
  }, [searchParams])

  const {
    habits,
    dateStatuses,
    selectedDate,
    setSelectedDate,
    isLoading,
    logProgress,
    completeHabit,
    archiveHabit,
  } = useHabits(initialDate)

  useEffect(() => {
    const nextDate = format(selectedDate, "yyyy-MM-dd")
    const currentDate = searchParams.get("date")
    if (currentDate === nextDate) return

    const next = new URLSearchParams(searchParams.toString())
    next.set("date", nextDate)
    router.replace(`/dashboard/habits?${next.toString()}`)
  }, [selectedDate, searchParams, router])

  return (
    <HabitsPageShell
      habits={habits}
      dateStatuses={dateStatuses}
      selectedDate={selectedDate}
      onSelectDate={setSelectedDate}
      onLogProgress={logProgress}
      onComplete={completeHabit}
      onArchive={archiveHabit}
      onOpenHabit={(habitId) => router.push(`/dashboard/habits/${habitId}`)}
      isLoading={isLoading}
    />
  )
}
