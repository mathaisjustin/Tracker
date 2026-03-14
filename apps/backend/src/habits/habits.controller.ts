import { supabase } from "../db/supabase"
import { createHabitService } from "./habits.service"

export const createHabit = async (req: any, res: any) => {
  try {

    const { user_id, name, color, type, unit, base_cost } = req.body

    const data = await createHabitService(
      user_id,
      name,
      color,
      type,
      unit,
      base_cost
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

  const selectedDate = date || new Date().toISOString().split("T")[0]

  const endOfDay = `${selectedDate}T23:59:59`

  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user_id)
    .lte("created_at", endOfDay)
    .or(`archived_at.is.null,archived_at.gt.${endOfDay}`)

  if (error) {
    return res.status(400).json(error)
  }

  res.json(data)
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