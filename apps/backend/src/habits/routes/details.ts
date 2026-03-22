// habits/routes/details.ts
// Mounted at: /api/habits/:habitId/details  (via habits/routes/index.ts)
// authMiddleware is applied at the parent router level — no need to repeat here

import { Router } from "express";
import { getHabitDetails, logHabitEntry } from "../controller/details";

const router = Router({ mergeParams: true }); // mergeParams exposes :habitId from parent

/**
 * GET /api/habits/:habitId/details
 * Full habit data for the detail page
 */
router.get("/", getHabitDetails);

/**
 * POST /api/habits/:habitId/details/log
 * Increment or decrement today's entry
 * Body: { action: "increment" | "decrement" }
 */
router.post("/log", logHabitEntry);

export default router;