"use client"

import { useRouter } from "next/navigation"
import { CreateHabitForm } from "@/components/habits"

export default function CreateHabitPage() {
  const router = useRouter()

  return (
    <div className="px-4 pt-1 pb-6 space-y-6">
      <CreateHabitForm />
    </div>
  )
}