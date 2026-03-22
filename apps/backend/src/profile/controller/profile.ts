import { Request, Response } from "express";
import { getProfileService, completeOnboardingService } from "../service/profile";
// Profile Controller
// Handle profile-related HTTP requests
// Used in: /api/profile

export const getProfile = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const email = req.user.email;

  try {
    const profile = await getProfileService(userId, email);
    return res.json(profile);
  } catch (err: any) {
    console.error("[GET /api/profile]", err.message);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const completeOnboarding = async (req: Request, res: Response) => {
  const userId = req.user.id;

  try {
    const profile = await completeOnboardingService(userId);
    return res.json(profile);
  } catch (err: any) {
    console.error("[PATCH /api/profile/onboarding]", err.message);
    return res.status(500).json({ error: "Failed to complete onboarding" });
  }
};