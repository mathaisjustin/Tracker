import express from "express"
import {
  getProfile,
  completeOnboarding
} from "./profile.controller"

const router = express.Router()

router.patch("/onboarding", completeOnboarding)

router.get("/:user_id", getProfile)

export default router