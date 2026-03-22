import { Router } from "express";
import { getProfile, updateProfile, deleteProfile } from "../controller/profile";

const router = Router();

// authMiddleware: Add when you implement authentication
// router.use(authMiddleware);

/**
 * GET /api/profile
 * Get the logged-in user's profile
 */
router.get("/", getProfile);

/**
 * PUT /api/profile
 * Update the logged-in user's profile
 * Body: { email, name, preferences, theme, etc }
 */
router.put("/", updateProfile);

/**
 * DELETE /api/profile
 * Delete the logged-in user's profile and all data
 */
router.delete("/", deleteProfile);

export default router;
