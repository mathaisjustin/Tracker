import { Request, Response } from "express";
import { quickIncrementService } from "../service/quick-log";

// Quick Log Controller
// Handle quick increment/decrement from habits list page
// Used in: /api/entries/quick-log (single-click actions)

export const quickIncrementEntry = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { habitId, cost } = req.body;

  if (!habitId) {
    return res.status(400).json({ error: "habitId is required" });
  }

  try {
    const entry = await quickIncrementService(habitId, userId, cost);
    return res.json(entry);
  } catch (err: any) {
    if (err.message === "HABIT_NOT_FOUND") {
      return res.status(404).json({ error: "Habit not found" });
    }

    console.error("[POST /api/entries/quick-log/increment]", err.message);
    return res.status(500).json({ error: "Failed to log entry" });
  }
};

export const quickDecrementEntry = async (req: Request, res: Response) => {
  // TODO: Implement quick decrement logic
  // Single click from habits list page
  res.json({ message: "Quick decrement entry" });
};
