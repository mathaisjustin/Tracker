// Quick Log Service
// Business logic for quick entry increment/decrement operations
import { supabase } from "../../db/supabase";

export const quickIncrementService = async (
  habitId: string,
  userId: string,
  cost?: number
) => {
  const today = new Date().toISOString().split("T")[0];

  const { data: habit, error: habitError } = await supabase
    .from("habits")
    .select("id, daily_limit, base_cost")
    .eq("id", habitId)
    .eq("user_id", userId)
    .single();

  if (habitError || !habit) throw new Error("HABIT_NOT_FOUND");

  const { data: existing } = await supabase
    .from("habit_entries")
    .select("id, quantity, cost")
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .eq("entry_date", today)
    .single();

  const currentQuantity = existing?.quantity ?? 0;

  // Silently block if at cap
  if (habit.daily_limit !== null && currentQuantity >= habit.daily_limit) {
    return {
      habit_id: habitId,
      quantity: currentQuantity,
      entry_date: today,
      capped: true,
    };
  }

  const newQuantity = currentQuantity + 1;

  // Cumulative cost — add this increment's cost to running total
  const previousCost = Number(existing?.cost ?? 0);
  const incrementCost = Number(cost !== undefined ? cost : (habit.base_cost ?? 0));
  const totalCost = previousCost + incrementCost;

  let entry;

  if (existing) {
    const { data, error } = await supabase
      .from("habit_entries")
      .update({
        quantity: newQuantity,
        cost: totalCost,
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    entry = data;
  } else {
    const { data, error } = await supabase
      .from("habit_entries")
      .insert({
        habit_id: habitId,
        user_id: userId,
        quantity: newQuantity,
        cost: totalCost,
        entry_date: today,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    entry = data;
  }

  return entry;
};

export const quickDecrementService = async (habitId: string, userId: string) => {
  // TODO: Implement service logic
  // Quick decrement from habits list page
};
