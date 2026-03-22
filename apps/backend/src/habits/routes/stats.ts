import { Router } from "express";
import { getStats, getStreaks, getProgress } from "../controller/stats";

const router = Router({ mergeParams: true });

// authMiddleware: Add when you implement authentication
// router.use(authMiddleware);

/**
 * GET /api/habits/:habitId/stats
 * Get statistics for a specific habit
 * Returns: best streak, current streak, total entries, completion rate
 */
router.get("/", getStats);

/**
 * GET /api/habits/:habitId/stats/streaks
 * Get streak information for a specific habit
 */
router.get("/streaks", getStreaks);

/**
 * GET /api/habits/:habitId/stats/progress
 * Get progress/completion data for a specific habit
 */
router.get("/progress", getProgress);

export default router;
