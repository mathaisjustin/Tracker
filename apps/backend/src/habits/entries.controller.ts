import { supabase } from "../db/supabase"

export const incrementHabit = async (req: any, res: any) => {

  const { habit_id, user_id, quantity, cost, note } = req.body

  const { data, error } = await supabase
    .from("habit_entries")
    .insert({
      habit_id,
      user_id,
      quantity,
      cost,
      note
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