import express from "express";
import {
  signup,
  login,
  forgotPassword,
  oauthGoogle,
  oauthGithub,
  getMe,
  logout,
} from "./auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

router.get("/google", oauthGoogle);
router.get("/github", oauthGithub);

router.get("/me", getMe);

router.post("/logout", logout);

export default router;