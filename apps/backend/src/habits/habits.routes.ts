import express from "express"
import {
  createHabit,
  getHabits,
  getHabitDateStatuses,
  archiveHabit,
  bulkArchiveHabits
} from "./habits.controller"

const router = express.Router()

router.post("/", createHabit)

/* archive routes first */

router.get("/status/:user_id", getHabitDateStatuses)

router.patch("/archive/:id", archiveHabit)

router.patch("/bulk-archive", bulkArchiveHabits)

/* dynamic routes last */

router.get("/:user_id", getHabits)

export default router