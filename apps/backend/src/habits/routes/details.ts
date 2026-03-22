import { Router } from "express";
// import { getHabitDetails, archiveHabit } from "../controller/details";
import statsRoutes from "./stats";

const router = Router({ mergeParams: true });

// authMiddleware: Add when you implement authentication
// router.use(authMiddleware);

/**
 * GET /api/habits/:habitId/details
 * Get detailed information about a specific habit
 * Shows: basic info, current progress, recent entries, streaks
 */
// TODO: Uncomment when controller is ready
// router.get("/", getHabitDetails);

/**
 * PATCH /api/habits/:habitId/details/archive
 * Archive a specific habit
 */
// TODO: Uncomment when controller is ready
// router.patch("/archive", archiveHabit);

/**
 * Nested routes for habit statistics
 * /api/habits/:habitId/stats
 */
router.use("/stats", statsRoutes);

export default router;
