import { Router } from "express";
import habitRoutes from "../habits/habits.routes"
import entryRoutes from "../habits/entries.routes"
import profileRoutes from "../profile/profile.routes"

const router = Router();

router.use("/habits", habitRoutes)

router.use("/entries", entryRoutes)

router.use("/profile", profileRoutes)

export default router;