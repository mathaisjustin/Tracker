import { Request, Response } from "express";
import { getHabitsService, createHabitService, updateHabitService, deleteHabitService, archiveHabitService } from "../service/habits";
// Habits Controller
// Handle habit-related HTTP requests
// Used in: /api/habits (list, create, update, delete)

export const getHabits = async (req: Request, res: Response) => {
  const userId = req.user.id;

  // Default to today if no date param provided
  const date =
    typeof req.query.date === "string"
      ? req.query.date
      : new Date().toISOString().split("T")[0];

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
  }

  try {
    const data = await getHabitsService(userId, date);
    return res.json(data);
  } catch (err: any) {
    console.error("[GET /api/habits]", err.message);
    return res.status(500).json({ error: "Failed to fetch habits." });
  }
};

export const createHabit = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { name, type, unit, color, base_cost, daily_limit } = req.body;

  // Validate required fields
  if (!name || !type || !unit || !color) {
    return res.status(400).json({ error: "name, type, unit and color are required" });
  }

  if (!["good", "bad"].includes(type)) {
    return res.status(400).json({ error: "type must be good or bad" });
  }

  try {
    const habit = await createHabitService(userId, {
      name,
      type,
      unit,
      color,
      base_cost,
      daily_limit,
    });

    return res.status(201).json(habit);
  } catch (err: any) {
    if (err.message === "FREE_LIMIT_REACHED") {
      return res.status(403).json({
        error: "FREE_LIMIT_REACHED",
        message: "Free accounts can only have 2 active habits. Upgrade to Pro for unlimited habits.",
      });
    }

    console.error("[POST /api/habits]", err.message);
    return res.status(500).json({ error: "Failed to create habit" });
  }
};

export const updateHabit = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const habitId = req.params.id as string;
  const { name, type, unit, color, base_cost, daily_limit } = req.body;

  // Must send at least one field
  if (!name && !type && !unit && !color && base_cost === undefined && daily_limit === undefined) {
    return res.status(400).json({ error: "No fields provided to update" });
  }

  if (type && !["good", "bad"].includes(type)) {
    return res.status(400).json({ error: "type must be good or bad" });
  }

  // Build update object with only provided fields
  const updateData: Record<string, any> = {};
  if (name !== undefined) updateData.name = name;
  if (type !== undefined) updateData.type = type;
  if (unit !== undefined) updateData.unit = unit;
  if (color !== undefined) updateData.color = color;
  if (base_cost !== undefined) updateData.base_cost = base_cost;
  if (daily_limit !== undefined) updateData.daily_limit = daily_limit;

  try {
    const habit = await updateHabitService(habitId, userId, updateData);
    return res.json(habit);
  } catch (err: any) {
    if (err.message === "HABIT_NOT_FOUND") {
      return res.status(404).json({ error: "Habit not found" });
    }

    console.error("[PUT /api/habits/:id]", err.message);
    return res.status(500).json({ error: "Failed to update habit" });
  }
};

export const archiveHabit = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const habitId = req.params.id as string;

  try {
    const habit = await archiveHabitService(habitId, userId);
    return res.json(habit);
  } catch (err: any) {
    if (err.message === "HABIT_NOT_FOUND") {
      return res.status(404).json({ error: "Habit not found" });
    }
    if (err.message === "ALREADY_ARCHIVED") {
      return res.status(400).json({ error: "Habit is already archived" });
    }

    console.error("[PATCH /api/habits/:id/archive]", err.message);
    return res.status(500).json({ error: "Failed to archive habit" });
  }
};

export const deleteHabit = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const habitId = req.params.id as string;

  try {
    const result = await deleteHabitService(habitId, userId);
    return res.json(result);
  } catch (err: any) {
    if (err.message === "HABIT_NOT_FOUND") {
      return res.status(404).json({ error: "Habit not found" });
    }

    console.error("[DELETE /api/habits/:id]", err.message);
    return res.status(500).json({ error: "Failed to delete habit" });
  }
};