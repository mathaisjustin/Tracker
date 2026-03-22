"use client"

import { useEffect, useMemo, useState } from "react"
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

  const [selectedDate, setSelectedDate] = useState(initialDate)

  // ✅ IMPORTANT: include logProgress
  const { habits, isLoading, archiveHabit, logProgress } = useHabits()

  useEffect(() => {
    const nextDate = format(selectedDate, "yyyy-MM-dd")
    const currentDate = searchParams.get("date")

    if (currentDate === nextDate) return

    const next = new URLSearchParams(searchParams.toString())
    next.set("date", nextDate)

    router.replace(`/dashboard/habits?${next.toString()}`)
  }, [selectedDate, searchParams, router])

  const dateStatuses: any[] = []

  return (
    <HabitsPageShell
      habits={habits}
      dateStatuses={dateStatuses}
      selectedDate={selectedDate}
      onSelectDate={setSelectedDate}

      // ✅ CONNECTED
      onLogProgress={logProgress}

      onComplete={undefined}
      onArchive={archiveHabit}

      onOpenHabit={(habitId) =>
        router.push(`/dashboard/habits/${habitId}`)
      }

      isLoading={isLoading}
    />
  )
}