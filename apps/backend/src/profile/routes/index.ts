import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { getProfile, completeOnboarding } from "../controller/profile";

const router = Router();

// authMiddleware: Add when you implement authentication
router.use(authMiddleware);

/**
 * GET /api/profile
 * Get the logged-in user's profile
 */
router.get("/", getProfile);

/**
 * PATCH /api/profile/onboarding
 * Complete the onboarding process for the logged-in user
 */
router.patch("/onboarding", completeOnboarding);


export default router;
