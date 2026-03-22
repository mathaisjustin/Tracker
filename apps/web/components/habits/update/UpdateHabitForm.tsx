"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { isValid, parseISO } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field"
import { useAuth } from "@/lib/AuthProvider"
import { getHabits, updateHabit } from "@/lib/api/habits"
import { cn } from "@/lib/utils"

const updateHabitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["good", "bad"]),
  unit: z.string().min(1, "Unit is required"),
  base_cost: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : Number(v)),
    z.number().min(0).optional()
  ),
  daily_limit: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : Number(v)),
    z.number().min(1).optional()
  ),
  color: z.string().min(1, "Color is required"),
})

type UpdateHabitFormData = z.infer<typeof updateHabitSchema>

const PRESET_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#ffffff",
]

function getRandomColor(): string {
  return PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]
}

export function UpdateHabitForm() {
  const { session } = useAuth()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const habitId = params.id as string

  const selectedDateParam = searchParams.get("date")
  const selectedDate = selectedDateParam ? parseISO(selectedDateParam) : null
  const hasValidSelectedDate = selectedDate ? isValid(selectedDate) : false

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPrefilling, setIsPrefilling] = useState(true)
  const [formState, setFormState] = useState<Partial<UpdateHabitFormData>>({
    name: "",
    type: "good",
    unit: "",
    base_cost: undefined,
    daily_limit: undefined,
    color: getRandomColor(),
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false

    async function prefillHabit() {
      if (!session?.access_token || !habitId) {
        if (!cancelled) setIsPrefilling(false)
        return
      }

      try {
        const { habits } = await getHabits(
          session.access_token,
          hasValidSelectedDate ? selectedDateParam ?? undefined : undefined
        )

        const existing = habits.find((h) => h.id === habitId)

        if (!existing) {
          if (!cancelled) {
            setError("Could not find this habit to prefill.")
          }
          return
        }

        if (!cancelled) {
          setFormState((prev) => ({
            ...prev,
            name: existing.name,
            type: existing.type,
            unit: existing.targetUnit,
            daily_limit: existing.target ?? undefined,
            color: existing.color,
          }))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load habit")
        }
      } finally {
        if (!cancelled) setIsPrefilling(false)
      }
    }

    prefillHabit()

    return () => {
      cancelled = true
    }
  }, [session?.access_token, habitId, hasValidSelectedDate, selectedDateParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    const result = updateHabitSchema.safeParse({
      name: formState.name ?? "",
      type: formState.type ?? "good",
      unit: formState.unit ?? "",
      base_cost: formState.base_cost ?? "",
      daily_limit: formState.daily_limit ?? "",
      color: formState.color ?? "",
    })

    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path[0]?.toString()
        if (path) errors[path] = issue.message
      })
      setFieldErrors(errors)
      return
    }

    if (!session?.access_token) {
      setError("You must be signed in to update a habit.")
      return
    }

    setIsSubmitting(true)
    try {
      await updateHabit(session.access_token, habitId, {
        name: result.data.name,
        color: result.data.color,
        type: result.data.type,
        unit: result.data.unit,
        base_cost: result.data.base_cost,
        daily_limit: result.data.daily_limit,
      })

      router.replace(
        hasValidSelectedDate
          ? `/dashboard/habits?date=${selectedDateParam}`
          : "/dashboard/habits"
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update habit")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col gap-6">
      <header className="-mx-2 flex items-center gap-3">
        <Link
          href={hasValidSelectedDate ? `/dashboard/habits?date=${selectedDateParam}` : "/dashboard/habits"}
          className="rounded-lg p-2 -ml-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          aria-label="Back to habits"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">Update Habit</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 overflow-hidden">
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {error}
          </div>
        )}

        {isPrefilling ? (
          <p className="text-sm text-zinc-400">Loading habit data...</p>
        ) : null}

        <Field>
          <FieldLabel>NAME</FieldLabel>
          <Input
            value={formState.name ?? ""}
            onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
            className="bg-zinc-900 border-zinc-700 text-white"
          />
          {fieldErrors.name && <FieldError>{fieldErrors.name}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>TYPE</FieldLabel>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormState((s) => ({ ...s, type: "good" as const }))}
              className={cn(
                "flex-1 rounded-lg border px-4 py-3 text-left transition-colors",
                formState.type === "good"
                  ? "border-green-500 bg-green-500/10 text-green-400"
                  : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600"
              )}
            >
              <span className="font-medium">Good</span>
              <p className="text-xs text-zinc-500">Build streaks</p>
            </button>
            <button
              type="button"
              onClick={() => setFormState((s) => ({ ...s, type: "bad" as const }))}
              className={cn(
                "flex-1 rounded-lg border px-4 py-3 text-left transition-colors",
                formState.type === "bad"
                  ? "border-red-500 bg-red-500/10 text-red-400"
                  : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600"
              )}
            >
              <span className="font-medium">Bad</span>
              <p className="text-xs text-zinc-500">Track & reduce</p>
            </button>
          </div>
        </Field>

        <Field>
          <FieldLabel>UNIT</FieldLabel>
          <Input
            value={formState.unit ?? ""}
            onChange={(e) => setFormState((s) => ({ ...s, unit: e.target.value }))}
            className="bg-zinc-900 border-zinc-700 text-white"
          />
          <FieldDescription>e.g. count, cups, minutes, km</FieldDescription>
          {fieldErrors.unit && <FieldError>{fieldErrors.unit}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>BASE COST</FieldLabel>
          <Input
            type="number"
            min={0}
            value={formState.base_cost ?? ""}
            onChange={(e) =>
              setFormState((s) => ({
                ...s,
                base_cost: e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            placeholder="10"
            className="bg-zinc-900 border-zinc-700 text-white"
          />
          <FieldDescription>Cost per unit</FieldDescription>
          {fieldErrors.base_cost && <FieldError>{fieldErrors.base_cost}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>DAILY LIMIT</FieldLabel>
          <Input
            type="number"
            min={1}
            value={formState.daily_limit ?? ""}
            onChange={(e) =>
              setFormState((s) => ({
                ...s,
                daily_limit: e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            placeholder="5"
            className="bg-zinc-900 border-zinc-700 text-white"
          />
          <FieldDescription>Max per day</FieldDescription>
          {fieldErrors.daily_limit && <FieldError>{fieldErrors.daily_limit}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>COLOR</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => setFormState((s) => ({ ...s, color: hex }))}
                className={cn(
                  "size-10 rounded-full border-2 transition-colors",
                  formState.color === hex
                    ? "border-white ring-2 ring-white/30"
                    : "border-transparent hover:border-zinc-600"
                )}
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
          </div>
          {fieldErrors.color && <FieldError>{fieldErrors.color}</FieldError>}
        </Field>

        <Button
          type="submit"
          className="w-full py-6 text-base"
          disabled={isSubmitting || isPrefilling}
        >
          {isSubmitting ? "Updating..." : "Update Habit"}
        </Button>
      </form>
    </div>
  )
}
