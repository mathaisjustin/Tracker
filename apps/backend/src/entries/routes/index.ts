import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { getEntries, createEntry, updateEntry, deleteEntry } from "../controller/entries";
import quickLogRoutes from "./quick-log";

const router = Router();

// authMiddleware: Add when you implement authentication
router.use(authMiddleware);

/**
 * GET /api/entries
 * Get all entries for the logged-in user (or for a specific habit via query)
 * Optional query: ?habitId=xxx
 */
router.get("/", getEntries);

/**
 * POST /api/entries
 * Create a new entry
 * Used for detailed entry management in habit details page
 * Body: { habitId, quantity, entry_date }
 */
router.post("/", createEntry);

/**
 * PUT /api/entries/:id
 * Update an existing entry (increment/decrement quantity)
 */
router.put("/:id", updateEntry);

/**
 * DELETE /api/entries/:id
 * Delete an entry
 */
router.delete("/:id", deleteEntry);

/**
 * Nested routes for quick log operations
 * /api/entries/quick-log/increment
 * /api/entries/quick-log/decrement
 */
router.use("/quick-log", quickLogRoutes);

export default router;
