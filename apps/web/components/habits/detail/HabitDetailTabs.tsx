import { cn } from "@/lib/utils"

import type { HabitDetailTab } from "./types"

interface HabitDetailTabsProps {
  activeTab: HabitDetailTab
  onChange: (tab: HabitDetailTab) => void
}

export function HabitDetailTabs({ activeTab, onChange }: HabitDetailTabsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-1">
      <button
        type="button"
        onClick={() => onChange("log")}
        className={cn(
          "rounded-xl px-4 py-2 text-sm font-medium transition",
          activeTab === "log" ? "bg-white text-black" : "text-zinc-400 hover:text-zinc-200"
        )}
      >
        Log
      </button>
      <button
        type="button"
        onClick={() => onChange("stats")}
        className={cn(
          "rounded-xl px-4 py-2 text-sm font-medium transition",
          activeTab === "stats" ? "bg-white text-black" : "text-zinc-400 hover:text-zinc-200"
        )}
      >
        Stats
      </button>
    </div>
  )
}
