import { cn } from "@/lib/utils"
import type { FilterTab } from "@/lib/types/habits"

interface FilterTabsProps {
  activeFilter: FilterTab
  onFilterChange: (filter: FilterTab) => void
}

const TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "done", label: "Done" },
]

export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  return (
    <div className="flex gap-2">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onFilterChange(tab.value)}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            activeFilter === tab.value
              ? "bg-zinc-800 text-white"
              : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-300"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
