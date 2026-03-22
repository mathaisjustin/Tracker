// Habits Service
// Business logic for habit operations
import { supabase } from "../../db/supabase";

export const getHabitsService = async (userId: string, date: string) => {
  const { data, error } = await supabase.rpc("get_habits_for_date", {
    p_user_id: userId,
    p_date: date,
  });

  if (error) throw new Error(error.message);

  return data as {
    habits: {
      id: string;
      name: string;
      color: string;
      type: "good" | "bad";
      unit: string | null;
      target: number | null;
      current: number;
      has_entry: boolean;
    }[];
    day_progress: number;
  };
};

export const createHabitService = async (
  userId: string,
  data: {
    name: string;
    type: "good" | "bad";
    unit: string;
    color: string;
    base_cost?: number;
    daily_limit?: number;
  }
) => {
  // Check if user is pro
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    throw new Error("Could not fetch user profile");
  }

  // If not pro, count active habits
  if (!profile.is_pro) {
    const { count, error: countError } = await supabase
      .from("habits")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_archived", false);

    if (countError) throw new Error("Could not check habit count");

    if ((count ?? 0) >= 2) {
      throw new Error("FREE_LIMIT_REACHED");
    }
  }

  // Create the habit
  const { data: habit, error } = await supabase
    .from("habits")
    .insert({
      user_id: userId,
      name: data.name,
      type: data.type,
      unit: data.unit,
      color: data.color,
      base_cost: data.base_cost ?? 0,
      daily_limit: data.daily_limit ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return habit;
};

export const updateHabitService = async (
  habitId: string,
  userId: string,
  data: {
    name?: string;
    type?: "good" | "bad";
    unit?: string;
    color?: string;
    base_cost?: number;
    daily_limit?: number | null;
  }
) => {
  // Verify habit belongs to this user
  const { data: existing, error: fetchError } = await supabase
    .from("habits")
    .select("id")
    .eq("id", habitId)
    .eq("user_id", userId)
    .single();

  if (fetchError || !existing) {
    throw new Error("HABIT_NOT_FOUND");
  }

  const { data: habit, error } = await supabase
    .from("habits")
    .update(data)
    .eq("id", habitId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return habit;
};

export const archiveHabitService = async (habitId: string, userId: string) => {
  // Verify habit belongs to this user
  const { data: existing, error: fetchError } = await supabase
    .from("habits")
    .select("id, is_archived")
    .eq("id", habitId)
    .eq("user_id", userId)
    .single();

  if (fetchError || !existing) throw new Error("HABIT_NOT_FOUND");
  if (existing.is_archived) throw new Error("ALREADY_ARCHIVED");

  const { data: habit, error } = await supabase
    .from("habits")
    .update({
      is_archived: true,
      archived_at: new Date().toISOString(),
    })
    .eq("id", habitId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return habit;
};

export const deleteHabitService = async (habitId: string, userId: string) => {
  // Verify habit belongs to this user
  const { data: existing, error: fetchError } = await supabase
    .from("habits")
    .select("id")
    .eq("id", habitId)
    .eq("user_id", userId)
    .single();

  if (fetchError || !existing) throw new Error("HABIT_NOT_FOUND");

  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", habitId);

  if (error) throw new Error(error.message);

  return { success: true };
};
