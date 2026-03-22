import { Request, Response } from "express";

// Habit Details Controller
// Handle individual habit details and information
// Used in: /api/habits/:habitId/details

export const getHabitDetails = async (req: Request, res: Response) => {
  // TODO: Implement get habit details logic
  // Shows: basic info, current progress, recent entries, streaks
  res.json({ message: "Get habit details" });
};

export const archiveHabit = async (req: Request, res: Response) => {
  // TODO: Implement archive habit logic
  res.json({ message: "Archive habit" });
};
