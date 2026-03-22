import { Router } from "express";
import { quickIncrementEntry } from "../controller/quick-log";
// import { quickIncrementEntry, quickDecrementEntry } from "../controller/quick-log";

const router = Router();

// authMiddleware: Add when you implement authentication
// router.use(authMiddleware);

/**
 * POST /api/entries/quick-log/increment
 * Quick increment (single click) from habits list page
 * Body: { habitId: string }
 * Returns: updated entry with new quantity
 * Component: Habits list page - single click button
 */
// TODO: Uncomment when controller is ready
router.post("/increment", quickIncrementEntry);

/**
 * POST /api/entries/quick-log/decrement
 * Quick decrement from habits list page
 * Body: { habitId: string }
 * Returns: updated entry with new quantity
 * Component: Habits list page - single click button
 */
// TODO: Uncomment when controller is ready
// router.post("/decrement", quickDecrementEntry);

export default router;
