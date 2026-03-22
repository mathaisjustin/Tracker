// habits/controller/details.ts
// HTTP handlers for habit detail page
// Routes: GET  /api/habits/:habitId/details
//         POST /api/habits/:habitId/details/log

import { Request, Response } from "express";
import { getHabitDetailsService, logHabitEntryService } from "../service/details";

/**
 * GET /api/habits/:habitId/details
 * Returns full habit data needed for the detail page:
 *   metadata, todayValue, streak, bestDay, avgPerDay, weeklyData, recentEntries
 */
export const getHabitDetails = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const habitId = req.params.habitId as string;

  if (!habitId) {
    return res.status(400).json({ error: "habitId is required" });
  }

  try {
    const data = await getHabitDetailsService(habitId, userId);
    return res.json(data);
  } catch (err: any) {
    if (err.message === "HABIT_NOT_FOUND") {
      return res.status(404).json({ error: "Habit not found" });
    }
    if (err.message === "HABIT_ARCHIVED") {
      return res.status(410).json({ error: "Habit is archived" });
    }

    console.error("[GET /api/habits/:habitId/details]", err.message);
    return res.status(500).json({ error: "Failed to fetch habit details" });
  }
};

/**
 * POST /api/habits/:habitId/details/log
 * Increment or decrement today's entry for a habit
 * Body: { action: "increment" | "decrement" }
 * Returns: { quantity: number }
 */
export const logHabitEntry = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const habitId = req.params.habitId as string;
  const { action } = req.body;

  if (!habitId) {
    return res.status(400).json({ error: "habitId is required" });
  }

  if (action !== "increment" && action !== "decrement") {
    return res.status(400).json({ error: "action must be 'increment' or 'decrement'" });
  }

  try {
    const result = await logHabitEntryService(habitId, userId, action);
    return res.json(result);
  } catch (err: any) {
    if (err.message === "HABIT_NOT_FOUND") {
      return res.status(404).json({ error: "Habit not found" });
    }

    console.error("[POST /api/habits/:habitId/details/log]", err.message);
    return res.status(500).json({ error: "Failed to log entry" });
  }
};