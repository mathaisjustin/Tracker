import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { getHabits, createHabit, updateHabit, deleteHabit, archiveHabit } from "../controller/habits";
import detailsRoutes from "./details";

// authMiddleware: Add when you implement authentication
// router.use(authMiddleware);

const router = Router();
router.use(authMiddleware);

/**
 * GET /api/habits
 * Get all habits for the logged-in user
 * Shows: list of habits with today's progress
 */
router.get("/", getHabits);

/**
 * POST /api/habits
 * Create a new habit
 * Body: { name, color, type, unit, daily_limit }
 */
router.post("/", createHabit);

/**
 * PUT /api/habits/:id
 * Update a habit
 */
router.put("/:id", updateHabit);

/**
 * PATCH /api/habits/:id/archive
 * Archive a habit
 */
router.patch("/:id/archive", archiveHabit);

/**
 * DELETE /api/habits/:id
 * Delete/archive a habit
 */
router.delete("/:id", deleteHabit);

/**
 * Nested routes for habit details and stats
 * /api/habits/:habitId/details
 * /api/habits/:habitId/stats
 */
router.use("/:habitId/details", detailsRoutes);

export default router;
