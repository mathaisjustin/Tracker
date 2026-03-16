import { BookOpen, Brain, Droplet, Footprints } from "lucide-react"

import { cn } from "@/lib/utils"

const ICON_MAP = {
  walk: Footprints,
  water: Droplet,
  read: BookOpen,
  meditate: Brain,
} as const

interface HabitIconProps {
  icon: string
  className?: string
}

export function HabitIcon({ icon, className }: HabitIconProps) {
  const Icon = ICON_MAP[icon as keyof typeof ICON_MAP] ?? BookOpen

  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800",
        icon === "walk" && "text-orange-400",
        icon === "water" && "text-blue-400",
        icon === "read" && "text-amber-400",
        icon === "meditate" && "text-yellow-400",
        className
      )}
    >
      <Icon className="size-5" />
    </div>
  )
}
