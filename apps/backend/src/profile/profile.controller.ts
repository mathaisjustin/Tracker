import { Request, Response } from "express"
import { supabase } from "../db/supabase"

const getUserFromToken = async (req: Request) => {
  const token = req.headers.authorization?.replace("Bearer ", "")

  if (!token) return null

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data?.user) return null

  return data.user
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await getUserFromToken(req)

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    console.log("USER ID:", user.id)

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    console.log("PROFILE DATA:", data)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    if (!data) {
      return res.status(404).json({ error: "Profile not found" })
    }

    return res.json(data)

  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
}

export const completeOnboarding = async (req: Request, res: Response) => {
  try {
    const user = await getUserFromToken(req)

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id)
      .select()
      .single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.json(data)

  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
}