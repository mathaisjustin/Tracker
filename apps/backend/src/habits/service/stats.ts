// habits/service/stats.ts
// Business logic for habit stats page
// Provides: summary card, calendar, momentum score, heatmap
// Used by: GET /api/habits/:habitId/stats

import { supabase } from "../../db/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StatsSummary {
  bestDay: { date: string; value: number };
  completionRate: { thisMonth: number; thisYear: number };
  // goal habits → perfectDays, no-goal habits → longestStreak
  goalStat:
    | { type: "perfectDays"; value: number }
    | { type: "longestStreak"; value: number };
  totalEntries: number;
}

export interface CalendarDay {
  date: string;       // YYYY-MM-DD
  value: number;
  progress: number;   // 0.0–1.0 for the ring
}

export interface CalendarData {
  month: string;      // YYYY-MM
  days: CalendarDay[];
}

export interface WeeklyPoint {
  weekOf: string;     // YYYY-MM-DD (Monday of that week)
  score: number;      // 0–100
}

export interface MomentumData {
  score: number;                          // current week score 0–100
  delta: number;                          // vs last week
  personalBest: { score: number; weekOf: string };
  weeklyPoints: WeeklyPoint[];            // 10 weeks oldest → newest for sparkline
}

export interface HeatmapDay {
  date: string;
  value: number;
  intensity: number;  // 0–4
}

export interface HeatmapWeek {
  weekOf: string;     // Monday of that week
  days: HeatmapDay[];
}

export interface HabitStatsResult {
  summary: StatsSummary;
  calendar: CalendarData;
  momentum: MomentumData;
  heatmap: HeatmapWeek[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Returns the Monday on or before a given date */
function getMondayOf(d: Date): Date {
  const day = d.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  return monday;
}

/**
 * Computes a week score (0–100) from an array of daily entries in that week.
 * Combines frequency (days logged / 7) and progress (avg daily progress).
 * For no-goal habits: presence = full progress (1.0) for that day.
 */
function computeWeekScore(
  weekDays: { date: string; quantity: number }[],
  goal: number | null
): number {
  const slots = 7;
  const dayMap: Record<string, number> = {};
  for (const e of weekDays) {
    dayMap[e.date] = Number(e.quantity);
  }

  let totalProgress = 0;
  let daysLogged = 0;

  for (const qty of Object.values(dayMap)) {
    if (qty > 0) {
      daysLogged++;
      if (goal !== null) {
        totalProgress += Math.min(qty / goal, 1);
      } else {
        totalProgress += 1; // presence = full credit
      }
    }
  }

  const frequencyScore = (daysLogged / slots) * 50;
  const progressScore =
    daysLogged > 0 ? (totalProgress / slots) * 50 : 0;

  return Math.round(frequencyScore + progressScore);
}

/**
 * Computes intensity bucket (0–4) for heatmap
 * based on value relative to the max observed value.
 */
function computeIntensity(value: number, maxValue: number): number {
  if (value <= 0 || maxValue <= 0) return 0;
  const ratio = value / maxValue;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

// ─── Main Service ─────────────────────────────────────────────────────────────

export const getHabitStatsService = async (
  habitId: string,
  userId: string
): Promise<HabitStatsResult> => {

  // 1. Fetch habit — verify ownership
  const { data: habit, error: habitError } = await supabase
    .from("habits")
    .select("id, daily_limit, type, is_archived")
    .eq("id", habitId)
    .eq("user_id", userId)
    .single();

  if (habitError || !habit) throw new Error("HABIT_NOT_FOUND");
  if (habit.is_archived) throw new Error("HABIT_ARCHIVED");

  const goal: number | null = habit.daily_limit ?? null;

  // 2. Fetch ALL entries for this habit (needed for summary + momentum + heatmap)
  const { data: allEntries, error: allError } = await supabase
    .from("habit_entries")
    .select("entry_date, quantity")
    .eq("habit_id", habitId)
    .eq("user_id", userId)
    .order("entry_date", { ascending: true });

  if (allError) throw new Error(allError.message);

  const entries = (allEntries ?? []).map((e) => ({
    date: e.entry_date as string,
    quantity: Number(e.quantity),
  }));

  const today = new Date();
  const todayStr = toDateStr(today);

  // ─── Card 1: Summary ────────────────────────────────────────────────────────

  // Best day
  let bestDay = { date: "", value: 0 };
  for (const e of entries) {
    if (e.quantity > bestDay.value) {
      bestDay = { date: e.date, value: e.quantity };
    }
  }

  // Total entries
  const totalEntries = entries.length;

  // Completion rate helpers
  const nowYear = today.getFullYear();
  const nowMonth = today.getMonth() + 1;

  // Days in current month up to today
  const daysThisMonthSoFar = today.getDate();
  // Days in current year up to today
  const startOfYear = new Date(nowYear, 0, 1);
  const daysThisYearSoFar = Math.floor(
    (today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  let completedDaysThisMonth = 0;
  let completedDaysThisYear = 0;

  for (const e of entries) {
    if (e.date > todayStr) continue; // skip future

    const [y, m] = e.date.split("-").map(Number);
    const isComplete =
      goal !== null ? e.quantity >= goal : e.quantity > 0;

    if (isComplete) {
      if (y === nowYear) completedDaysThisYear++;
      if (y === nowYear && m === nowMonth) completedDaysThisMonth++;
    }
  }

  const completionRate = {
    thisMonth: daysThisMonthSoFar > 0
      ? Math.round((completedDaysThisMonth / daysThisMonthSoFar) * 100)
      : 0,
    thisYear: daysThisYearSoFar > 0
      ? Math.round((completedDaysThisYear / daysThisYearSoFar) * 100)
      : 0,
  };

  // goalStat: perfectDays (goal habits) vs longestStreak (no-goal habits)
  let goalStat: StatsSummary["goalStat"];

  if (goal !== null) {
    // Count perfect days = days where quantity >= goal
    const perfectDays = entries.filter(
      (e) => e.quantity >= goal && e.date <= todayStr
    ).length;
    goalStat = { type: "perfectDays", value: perfectDays };
  } else {
    // Longest consecutive day streak
    const dateset = new Set(
      entries.filter((e) => e.quantity > 0 && e.date <= todayStr).map((e) => e.date)
    );

    let longest = 0;
    let current = 0;
    let cursor = new Date(today);

    // Walk backwards from today to find longest run
    // First find the earliest entry date to know when to stop
    const sortedDates = [...dateset].sort();
    if (sortedDates.length > 0) {
      const earliest = new Date(sortedDates[0] + "T00:00:00");
      cursor = new Date(today);

      let runLength = 0;
      while (cursor >= earliest) {
        const ds = toDateStr(cursor);
        if (dateset.has(ds)) {
          runLength++;
          longest = Math.max(longest, runLength);
        } else {
          runLength = 0;
        }
        cursor.setDate(cursor.getDate() - 1);
      }
      current = longest;
    }

    goalStat = { type: "longestStreak", value: current };
  }

  const summary: StatsSummary = {
    bestDay,
    completionRate,
    goalStat,
    totalEntries,
  };

  // ─── Card 2: Calendar ────────────────────────────────────────────────────────

  const monthStr = `${nowYear}-${String(nowMonth).padStart(2, "0")}`;
  const daysInMonth = new Date(nowYear, nowMonth, 0).getDate();

  // Build a map of entry_date → quantity for fast lookup
  const entryMap: Record<string, number> = {};
  for (const e of entries) {
    entryMap[e.date] = e.quantity;
  }

  const calendarDays: CalendarDay[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${monthStr}-${String(d).padStart(2, "0")}`;
    if (dateStr > todayStr) break; // don't show future days

    const value = entryMap[dateStr] ?? 0;
    const progress =
      goal !== null
        ? Math.min(value / goal, 1)
        : value > 0
        ? 1
        : 0;

    calendarDays.push({ date: dateStr, value, progress });
  }

  const calendar: CalendarData = {
    month: monthStr,
    days: calendarDays,
  };

  // ─── Card 3: Momentum ────────────────────────────────────────────────────────

  // Build 10 weekly buckets ending with the current week
  // Current week: Mon–Sun containing today
  const currentMonday = getMondayOf(today);
  const weeklyPoints: WeeklyPoint[] = [];

  for (let w = 9; w >= 0; w--) {
    const weekMonday = new Date(currentMonday);
    weekMonday.setDate(currentMonday.getDate() - w * 7);

    const weekSunday = new Date(weekMonday);
    weekSunday.setDate(weekMonday.getDate() + 6);

    const weekMondayStr = toDateStr(weekMonday);
    const weekSundayStr = toDateStr(weekSunday);

    // Collect entries that fall in this week
    const weekEntries = entries.filter(
      (e) => e.date >= weekMondayStr && e.date <= weekSundayStr && e.date <= todayStr
    );

    const score = computeWeekScore(weekEntries, goal);
    weeklyPoints.push({ weekOf: weekMondayStr, score });
  }

  const currentScore = weeklyPoints[9].score;
  const lastWeekScore = weeklyPoints[8].score;
  const delta = currentScore - lastWeekScore;

  const personalBestPoint = weeklyPoints.reduce(
    (best, w) => (w.score > best.score ? w : best),
    weeklyPoints[0]
  );

  const momentum: MomentumData = {
    score: currentScore,
    delta,
    personalBest: {
      score: personalBestPoint.score,
      weekOf: personalBestPoint.weekOf,
    },
    weeklyPoints, // oldest → newest
  };

  // ─── Card 4: Heatmap ────────────────────────────────────────────────────────

  // 10 weeks of daily cells (70 cells), oldest → newest
  // Intensity 0–4 relative to max value in the window
  const heatmapStart = new Date(currentMonday);
  heatmapStart.setDate(currentMonday.getDate() - 9 * 7);
  const heatmapStartStr = toDateStr(heatmapStart);

  const heatmapEntries = entries.filter(
    (e) => e.date >= heatmapStartStr && e.date <= todayStr
  );

  const maxValue = heatmapEntries.reduce(
    (max, e) => (e.quantity > max ? e.quantity : max),
    0
  );

  const heatmap: HeatmapWeek[] = [];

  for (let w = 9; w >= 0; w--) {
    const weekMonday = new Date(currentMonday);
    weekMonday.setDate(currentMonday.getDate() - w * 7);
    const weekMondayStr = toDateStr(weekMonday);

    const days: HeatmapDay[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(weekMonday);
      day.setDate(weekMonday.getDate() + d);
      const dateStr = toDateStr(day);

      if (dateStr > todayStr) {
        // Future — include as empty so the grid is always 7 wide
        days.push({ date: dateStr, value: 0, intensity: 0 });
        continue;
      }

      const value = entryMap[dateStr] ?? 0;
      days.push({
        date: dateStr,
        value,
        intensity: computeIntensity(value, maxValue),
      });
    }

    heatmap.push({ weekOf: weekMondayStr, days });
  }

  return { summary, calendar, momentum, heatmap };
};