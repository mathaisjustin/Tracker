// habits/service/details.ts
// Business logic for habit detail page
// Provides: full habit metadata, today's value, week entries, all-time stats
// Used by: GET /api/habits/:habitId/details
//          POST /api/habits/:habitId/details/log

import { supabase } from "../../db/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HabitEntryRow {
  date: string;
  value: number;
  status: "complete" | "partial" | "missed" | "in_progress";
}

export interface HabitDetailsResult {
  id: string;
  name: string;
  color: string;
  unit: string;
  goal: number | null;
  type: "good" | "bad";
  streak: number;
  todayValue: number;
  progress: number;
  bestDay: number;
  avgPerDay: number;
  weeklyData: number[]; // 7 values Mon–Sun (or today's partial week), oldest → newest
  recentEntries: HabitEntryRow[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns YYYY-MM-DD using LOCAL date (avoids UTC timezone shift) */
function toDateStr(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Derives entry status given a value and an optional goal */
function deriveStatus(
  value: number,
  goal: number | null,
  isToday: boolean
): HabitEntryRow["status"] {
  if (goal === null) {
    // No goal — any entry counts as complete; zero on a past day = missed
    if (value > 0) return isToday ? "in_progress" : "complete";
    return isToday ? "in_progress" : "missed";
  }

  if (value >= goal) return "complete";
  if (value >= Math.ceil(goal / 2)) return isToday ? "in_progress" : "partial";
  if (value > 0) return isToday ? "in_progress" : "partial";
  return isToday ? "in_progress" : "missed";
}

// ─── Main Service ─────────────────────────────────────────────────────────────

export const getHabitDetailsService = async (
  habitId: string,
  userId: string,
  date?: string // YYYY-MM-DD, defaults to today
): Promise<HabitDetailsResult> => {
  // 1. Fetch habit row — verify ownership
  const { data: habit, error: habitError } = await supabase
    .from("habits")
    .select("id, name, color, unit, daily_limit, type, is_archived, created_at")
    .eq("id", habitId)
    .eq("user_id", userId)
    .single();

  if (habitError || !habit) throw new Error("HABIT_NOT_FOUND");
  if (habit.is_archived) throw new Error("HABIT_ARCHIVED");

  const goal: number | null = habit.daily_limit ?? null;

  // Date the habit was created — used to hide days before it existed
  const habitCreatedDate: string = habit.created_at
    ? (habit.created_at as string).slice(0, 10)
    : "1970-01-01";

  // 2. "Today" from the requested date param (or real today if absent)
  const today = date ? new Date(date + "T00:00:00") : new Date();
  const todayStr = toDateStr(today);

  // Build Sun–Sat window containing today
  const dayOfWeek = today.getDay(); // 0 = Sun
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek); // back to Sunday
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);

  const weekStart = toDateStr(sunday);
  const weekEnd = toDateStr(saturday);

  // 3. Fetch ALL historical entries for stats (bestDay, avgPerDay)
  const { data: allEntries, error: allError } = await supabase
    .from("habit_entries")
    .select("entry_date, quantity")
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .order("entry_date", { ascending: false });

  if (allError) throw new Error(allError.message);

  // 4. Fetch this week's entries for weeklyData + recentEntries
  const { data: weekEntries, error: weekError } = await supabase
    .from("habit_entries")
    .select("entry_date, quantity")
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .gte("entry_date", weekStart)
    .lte("entry_date", weekEnd)
    .order("entry_date", { ascending: true });

  if (weekError) throw new Error(weekError.message);

  // 5. Compute all-time stats
  const allValues = (allEntries ?? []).map((e) => Number(e.quantity));
  const bestDay = allValues.length > 0 ? Math.max(...allValues) : 0;
  const avgPerDay =
    allValues.length > 0
      ? allValues.reduce((sum, v) => sum + v, 0) / allValues.length
      : 0;

  // 6. Build weeklyData — 7 slots Mon–Sun, defaulting to 0
  const entryMap: Record<string, number> = {};
  for (const e of weekEntries ?? []) {
    entryMap[e.entry_date] = Number(e.quantity);
  }

  const weeklyData: number[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return entryMap[toDateStr(d)] ?? 0;
  });

  // 7. todayValue + progress
  const todayValue = entryMap[todayStr] ?? 0;
  const progress =
    goal !== null ? Math.min((todayValue / goal) * 100, 100) : 0;

  // 8. Streak — count consecutive days backwards from yesterday with value > 0
  //    (today is "in progress" so excluded from streak)
  let streak = 0;
  const sortedDates = (allEntries ?? [])
    .map((e) => e.entry_date)
    .filter((d) => d < todayStr)
    .sort()
    .reverse();

  const check = new Date(today);
  check.setDate(today.getDate() - 1);

  for (const dateStr of sortedDates) {
    if (dateStr === toDateStr(check)) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else {
      break;
    }
  }

  // 9. Build recentEntries from this week (newest first for display)
  const recentEntries: HabitEntryRow[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + (6 - i)); // newest first
    const dateStr = toDateStr(d);
    const value = entryMap[dateStr] ?? 0;
    const isToday = dateStr === todayStr;
    return {
      date: dateStr,
      value,
      status: deriveStatus(value, goal, isToday),
    };
  }).filter((e) => e.date <= todayStr && e.date >= habitCreatedDate);

  return {
    id: habit.id,
    name: habit.name,
    color: habit.color,
    unit: habit.unit ?? "",
    goal,
    type: habit.type,
    streak,
    todayValue,
    progress,
    bestDay,
    avgPerDay: Math.round(avgPerDay * 10) / 10,
    weeklyData,
    recentEntries,
  };
};

// ─── Log Entry Service (increment / decrement) ────────────────────────────────

export const logHabitEntryService = async (
  habitId: string,
  userId: string,
  action: "increment" | "decrement"
): Promise<{ quantity: number }> => {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Verify habit ownership
  const { data: habit, error: habitError } = await supabase
    .from("habits")
    .select("id, daily_limit, base_cost")
    .eq("id", habitId)
    .eq("user_id", userId)
    .single();

  if (habitError || !habit) throw new Error("HABIT_NOT_FOUND");

  // Fetch today's existing entry
  const { data: existing } = await supabase
    .from("habit_entries")
    .select("id, quantity, cost")
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .eq("entry_date", today)
    .single();

  const currentQuantity = Number(existing?.quantity ?? 0);

  // Cap check on increment
  if (
    action === "increment" &&
    habit.daily_limit !== null &&
    currentQuantity >= habit.daily_limit
  ) {
    return { quantity: currentQuantity };
  }

  // Floor check on decrement — never go below 0
  if (action === "decrement" && currentQuantity <= 0) {
    return { quantity: 0 };
  }

  const delta = action === "increment" ? 1 : -1;
  const newQuantity = currentQuantity + delta;

  // Cost tracking (only on increment; decrement reduces cost proportionally)
  const previousCost = Number(existing?.cost ?? 0);
  const baseCost = Number(habit.base_cost ?? 0);
  const newCost =
    action === "increment"
      ? previousCost + baseCost
      : Math.max(0, previousCost - baseCost);

  let entry;

  if (existing) {
    const { data, error } = await supabase
      .from("habit_entries")
      .update({ quantity: newQuantity, cost: newCost })
      .eq("id", existing.id)
      .select("quantity")
      .single();

    if (error) throw new Error(error.message);
    entry = data;
  } else {
    // Only insert on increment (decrement on a non-existent entry is a no-op)
    if (action === "decrement") return { quantity: 0 };

    const { data, error } = await supabase
      .from("habit_entries")
      .insert({
        habit_id: habitId,
        user_id: userId,
        quantity: newQuantity,
        cost: newCost,
        entry_date: today,
      })
      .select("quantity")
      .single();

    if (error) throw new Error(error.message);
    entry = data;
  }

  return { quantity: Number(entry.quantity) };
};