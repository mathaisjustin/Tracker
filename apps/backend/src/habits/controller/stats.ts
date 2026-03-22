import { Request, Response } from "express";

// Stats Controller
// Handle statistics-related HTTP requests
// Used in: /api/habits/:habitId/stats

export const getStats = async (req: Request, res: Response) => {
  // TODO: Implement get stats logic
  res.json({ message: "Get stats" });
};

export const getStreaks = async (req: Request, res: Response) => {
  // TODO: Implement get streaks logic
  res.json({ message: "Get streaks" });
};

export const getProgress = async (req: Request, res: Response) => {
  // TODO: Implement get progress logic
  res.json({ message: "Get progress" });
};
