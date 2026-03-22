"use client"

import { useEffect, useMemo, useState } from "react"
import { format, parseISO, isValid } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"

import { HabitsPageShell } from "@/components/habits"
import { useHabits } from "@/hooks/useHabits"
import { useEntries } from "@/hooks/useEntries"

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

  const { habits, setHabits, dateStatuses, isLoading, error, archiveHabit } =
    useHabits(selectedDate)

  const { logProgress } = useEntries({ habits, setHabits })

  const selectedDateParam = format(selectedDate, "yyyy-MM-dd")

  useEffect(() => {
    const currentDate = searchParams.get("date")
    if (currentDate === selectedDateParam) return
    const next = new URLSearchParams(searchParams.toString())
    next.set("date", selectedDateParam)
    router.replace(`/dashboard/habits?${next.toString()}`)
  }, [selectedDate, searchParams, router, selectedDateParam])

  return (
    <HabitsPageShell
      habits={habits}
      dateStatuses={dateStatuses}
      selectedDate={selectedDate}
      onSelectDate={setSelectedDate}
      onLogProgress={logProgress}
      onComplete={undefined}
      onArchive={archiveHabit}
      onEditHabit={(habitId) =>
        router.push(`/dashboard/habits/${habitId}/update?date=${selectedDateParam}`)
      }
      onOpenHabit={(habitId) =>
        router.push(`/dashboard/habits/${habitId}`)
      }
      isLoading={isLoading}
    />
  )
}