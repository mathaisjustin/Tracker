import { Router } from "express";
import habitsRoutes from "../habits/routes";
import entriesRoutes from "../entries/routes";
import profileRoutes from "../profile/routes";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Module routes
router.use("/habits", habitsRoutes);
router.use("/entries", entriesRoutes);
router.use("/profile", profileRoutes);

export default router;