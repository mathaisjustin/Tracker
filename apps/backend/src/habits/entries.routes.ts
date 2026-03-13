import express from "express"
import {
  incrementHabit,
  getHabitEntries
} from "./entries.controller"

const router = express.Router()

router.post("/", incrementHabit)

router.get("/:habit_id", getHabitEntries)

export default router