import { supabase } from "../db/supabase"

function toIsoDate(value: Date): string {
  return value.toISOString().split("T")[0]
}

export const incrementHabit = async (req: any, res: any) => {

  const { habit_id, user_id, quantity, cost, note, created_at } = req.body

  if (!habit_id || !user_id) {
    return res.status(400).json({ error: "habit_id and user_id are required" })
  }

  const entryDate = created_at ? new Date(created_at) : new Date()
  if (Number.isNaN(entryDate.getTime())) {
    return res.status(400).json({ error: "Invalid created_at value" })
  }

  const todayIso = toIsoDate(new Date())
  if (toIsoDate(entryDate) !== todayIso) {
    return res.status(400).json({ error: "Entries can only be logged for today" })
  }

  const { data: habit, error: habitError } = await supabase
    .from("habits")
    .select("id, user_id, archived_at")
    .eq("id", habit_id)
    .maybeSingle()

  if (habitError) {
    return res.status(400).json({ error: habitError.message })
  }

  if (!habit || habit.user_id !== user_id) {
    return res.status(403).json({ error: "Habit does not belong to user" })
  }

  if (habit.archived_at) {
    return res.status(400).json({ error: "Cannot log entry for archived habit" })
  }

  const { data, error } = await supabase
    .from("habit_entries")
    .insert({
      habit_id,
      user_id,
      quantity,
      cost,
      note,
      created_at: created_at ?? entryDate.toISOString()
    })
    .select()

  if (error) {
    return res.status(400).json(error)
  }

  res.json(data)
}

export const getHabitEntries = async (req: any, res: any) => {

  const { habit_id } = req.params

  const { data, error } = await supabase
    .from("habit_entries")
    .select("*")
    .eq("habit_id", habit_id)
    .order("created_at", { ascending: false })

  if (error) {
    return res.status(400).json(error)
  }

  res.json(data)
}