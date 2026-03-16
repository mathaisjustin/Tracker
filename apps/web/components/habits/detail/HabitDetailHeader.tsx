import Link from "next/link"
import { ArrowLeft, Archive, Droplets } from "lucide-react"

import type { Habit } from "@/lib/types/habits"

interface HabitDetailHeaderProps {
  habit: Habit
  backHref: string
}

export function HabitDetailHeader({ habit, backHref }: HabitDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          className="inline-flex size-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200"
          aria-label="Back to habits"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex items-center gap-2">
          <Droplets className="size-5 text-cyan-400" />
          <h1 className="text-2xl font-semibold text-white">{habit.name}</h1>
        </div>
      </div>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-200"
      >
        <Archive className="size-4" />
        Archive
      </button>
    </div>
  )
}
