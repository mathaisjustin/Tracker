// habits/routes/stats.ts
// Router for habit stats endpoint

import { Router } from "express";
import { getHabitStats } from "../controller/stats";

const router = Router({ mergeParams: true });

/**
 * GET /api/habits/:habitId/stats
 * All stats card data in one response
 */
router.get("/", getHabitStats);

export default router;