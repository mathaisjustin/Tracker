import { supabase } from "../db/supabase"

export const getProfile = async (req: any, res: any) => {
  try {
    const { user_id } = req.params

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .single()

    if (error) {
      return res.status(400).json(error)
    }

    return res.json(data)

  } catch (err) {
    return res.status(500).json({ error: "Server error" })
  }
}

export const completeOnboarding = async (req: any, res: any) => {
  try {
    const { user_id } = req.body

    const { data, error } = await supabase
      .from("profiles")
      .update({
        onboarding_completed: true
      })
      .eq("id", user_id)
      .select()
      .single()

    if (error) {
      return res.status(400).json(error)
    }

    return res.json(data)

  } catch (err) {
    return res.status(500).json({ error: "Server error" })
  }
}