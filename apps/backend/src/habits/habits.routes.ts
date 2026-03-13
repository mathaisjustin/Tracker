import express from "express"
import {
  createHabit,
  getHabits,
  archiveHabit,
  bulkArchiveHabits
} from "./habits.controller"

const router = express.Router()

router.post("/", createHabit)

/* archive routes first */

router.patch("/archive/:id", archiveHabit)

router.patch("/bulk-archive", bulkArchiveHabits)

/* dynamic routes last */

router.get("/:user_id", getHabits)

export default router