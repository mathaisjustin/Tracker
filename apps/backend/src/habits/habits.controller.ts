import { supabase } from "../db/supabase"
import { createHabitService } from "./habits.service"

export const createHabit = async (req: any, res: any) => {
  try {

    const {
      user_id,
      name,
      color,
      type,
      unit,
      base_cost,
      daily_limit,
      created_at
    } = req.body

    const data = await createHabitService(
      user_id,
      name,
      color,
      type,
      unit,
      base_cost,
      daily_limit,
      created_at
    )

    res.json(data)

  } catch (error: any) {

    res.status(400).json({
      error: error.message
    })

  }
}

export const getHabits = async (req: any, res: any) => {

  const { user_id } = req.params
  const { date } = req.query

  const { dayStart, dayEnd } = toDayBounds(typeof date === "string" ? date : undefined)

  const { data: habits, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user_id)
    .lte("created_at", dayEnd)
    .or(`archived_at.is.null,archived_at.gt.${dayEnd}`)

  if (error) {
    return res.status(400).json(error)
  }

  const habitIds = (habits ?? []).map((habit: any) => habit.id)

  if (habitIds.length === 0) {
    return res.json([])
  }

  const { data: dayEntries, error: dayEntriesError } = await supabase
    .from("habit_entries")
    .select("habit_id, quantity")
    .eq("user_id", user_id)
    .in("habit_id", habitIds)
    .gte("created_at", dayStart)
    .lte("created_at", dayEnd)

  if (dayEntriesError) {
    return res.status(400).json({ error: dayEntriesError.message })
  }

  const quantityByHabit = new Map<string, number>()
  for (const entry of dayEntries ?? []) {
    const quantity = Number(entry.quantity ?? 0)
    if (!Number.isFinite(quantity)) continue
    quantityByHabit.set(entry.habit_id, (quantityByHabit.get(entry.habit_id) ?? 0) + quantity)
  }

  const payload = (habits ?? []).map((habit: any) => {
    const selected_day_quantity = quantityByHabit.get(habit.id) ?? 0
    const target_quantity = habit.daily_limit != null
      ? Math.max(1, Number(habit.daily_limit))
      : parseTargetQuantity(habit.unit)

    return {
      ...habit,
      selected_day_quantity,
      target_quantity,
      selected_day_completed: selected_day_quantity >= target_quantity,
    }
  })

  res.json(payload)
}

function toIsoDate(value: string): string {
  return (value ?? "").replace("T", " ").split(" ")[0]
}

function parseTargetQuantity(unit: string | null | undefined): number {
  if (!unit) return 1

  const normalized = unit.trim().toLowerCase()
  if (normalized === "steps") return 10000

  const kMatch = normalized.match(/^(\d+(?:\.\d+)?)k$/)
  if (kMatch) {
    return Math.max(1, Math.round(Number(kMatch[1]) * 1000))
  }

  const mMatch = normalized.match(/^(\d+(?:\.\d+)?)m$/)
  if (mMatch) {
    return Math.max(1, Math.round(Number(mMatch[1])))
  }

  const numeric = Number(normalized)
  if (!Number.isNaN(numeric) && Number.isFinite(numeric) && numeric > 0) {
    return Math.round(numeric)
  }

  return 1
}

function toDayBounds(input: string | undefined): {
  selectedIso: string
  dayStart: string
  dayEnd: string
} {
  const raw = input && typeof input === "string" ? input : new Date().toISOString().split("T")[0]
  const selectedIso = toIsoDate(raw)

  return {
    selectedIso,
    dayStart: `${selectedIso}T00:00:00Z`,
    dayEnd: `${selectedIso}T23:59:59Z`,
  }
}

function eachDate(startIso: string, endIso: string): string[] {
  const out: string[] = []
  const cursor = new Date(`${startIso}T00:00:00Z`)
  const end = new Date(`${endIso}T00:00:00Z`)

  while (cursor <= end) {
    out.push(toIsoDate(cursor.toISOString()))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }

  return out
}

export const getHabitDateStatuses = async (req: any, res: any) => {
  try {
    const { user_id } = req.params
    const start = typeof req.query.start === "string" ? req.query.start : undefined
    const end = typeof req.query.end === "string" ? req.query.end : undefined

    if (!start || !end) {
      return res.status(400).json({ error: "start and end are required (YYYY-MM-DD)" })
    }

    const startIso = toIsoDate(start)
    const endIso = toIsoDate(end)
    const endOfRange = `${endIso}T23:59:59Z`

    const { data: habits, error: habitsError } = await supabase
      .from("habits")
      .select("id, unit, daily_limit, created_at, archived_at")
      .eq("user_id", user_id)
      .lte("created_at", endOfRange)
      .or(`archived_at.is.null,archived_at.gt.${startIso}T00:00:00Z`)

    if (habitsError) {
      return res.status(400).json({ error: habitsError.message })
    }

    const { data: entries, error: entriesError } = await supabase
      .from("habit_entries")
      .select("habit_id, quantity, created_at")
      .eq("user_id", user_id)
      .gte("created_at", `${startIso}T00:00:00Z`)
      .lte("created_at", endOfRange)

    if (entriesError) {
      return res.status(400).json({ error: entriesError.message })
    }

    const allDates = eachDate(startIso, endIso)
    const byDate = allDates.map((date) => {
      const dayStart = `${date}T00:00:00`
      const dayEnd = `${date}T23:59:59`
      const activeHabits = (habits ?? []).filter((habit: any) => {
        const createdDate = toIsoDate(habit.created_at ?? "")
        const archivedDate = habit.archived_at ? toIsoDate(habit.archived_at) : null
        return createdDate <= date && (archivedDate === null || archivedDate > date)
      })

      const activeIds = new Set(activeHabits.map((habit: any) => habit.id))
      const activeTargets = new Map<string, number>()
      for (const habit of activeHabits) {
        const target = habit.daily_limit != null
          ? Math.max(1, Number(habit.daily_limit))
          : parseTargetQuantity(habit.unit)
        activeTargets.set(habit.id, target)
      }

      const quantitiesByHabit = new Map<string, number>()
      for (const entry of entries ?? []) {
        if (toIsoDate(new Date(entry.created_at).toISOString()) !== date) continue
        if (!activeIds.has(entry.habit_id)) continue

        const quantity = Number(entry.quantity ?? 0)
        if (!Number.isFinite(quantity)) continue
        quantitiesByHabit.set(entry.habit_id, (quantitiesByHabit.get(entry.habit_id) ?? 0) + quantity)
      }

      let completionTotal = 0
      for (const [habitId, target] of activeTargets.entries()) {
        const quantity = quantitiesByHabit.get(habitId) ?? 0
        completionTotal += Math.min(1, quantity / Math.max(1, target))
      }

      const totalHabits = activeIds.size
      const trackedHabits = Array.from(quantitiesByHabit.values()).filter((quantity) => quantity > 0).length
      const completionRate = totalHabits > 0 ? completionTotal / totalHabits : 0

      return {
        date,
        hasActivity: trackedHabits > 0,
        completionRate,
        trackedHabits,
        totalHabits,
      }
    })

    res.json(byDate)
  } catch (_err) {
    res.status(500).json({ error: "Server error" })
  }
}

export const archiveHabit = async (req: any, res: any) => {
  try {

    const { id } = req.params

    const { data, error } = await supabase
      .from("habits")
      .update({
        is_archived: true,
        archived_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ success: true, data })

  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
}

export const bulkArchiveHabits = async (req: any, res: any) => {
  try {

    const { ids } = req.body

    if (!ids || ids.length === 0) {
      return res.status(400).json({ error: "No habit IDs provided" })
    }

    const { data, error } = await supabase
      .from("habits")
      .update({
        is_archived: true,
        archived_at: new Date().toISOString()
      })
      .in("id", ids)
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ success: true, data })

  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
}