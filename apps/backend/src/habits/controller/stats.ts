// habits/controller/stats.ts
// HTTP handler for habit stats page
// Route: GET /api/habits/:habitId/stats

import { Request, Response } from "express";
import { getHabitStatsService } from "../service/stats";

/**
 * GET /api/habits/:habitId/stats
 * Returns all data needed for the 4 stats cards:
 *   summary (bestDay, completionRate, goalStat, totalEntries)
 *   calendar (current month, per-day progress rings)
 *   momentum (score, delta, personalBest, 10-week sparkline)
 *   heatmap  (last 10 weeks, 70 cells with intensity 0–4)
 */
export const getHabitStats = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const habitId = req.params.habitId as string;

  if (!habitId) {
    return res.status(400).json({ error: "habitId is required" });
  }

  try {
    const data = await getHabitStatsService(habitId, userId);
    return res.json(data);
  } catch (err: any) {
    if (err.message === "HABIT_NOT_FOUND") {
      return res.status(404).json({ error: "Habit not found" });
    }
    if (err.message === "HABIT_ARCHIVED") {
      return res.status(410).json({ error: "Habit is archived" });
    }

    console.error("[GET /api/habits/:habitId/stats]", err.message);
    return res.status(500).json({ error: "Failed to fetch habit stats" });
  }
};