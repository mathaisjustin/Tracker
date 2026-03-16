import { HabitDetailHeader } from "./HabitDetailHeader"
import { HabitDetailLogTab } from "./HabitDetailLogTab"
import { HabitDetailStatsTab } from "./HabitDetailStatsTab"
import { HabitDetailTabs } from "./HabitDetailTabs"
import type { HabitDetailModel, HabitDetailTab } from "./types"

interface HabitDetailShellProps {
  detail: HabitDetailModel
  activeTab: HabitDetailTab
  onChangeTab: (tab: HabitDetailTab) => void
  backHref: string
}

export function HabitDetailShell({ detail, activeTab, onChangeTab, backHref }: HabitDetailShellProps) {
  return (
    <div className="space-y-4 pb-6">
      <HabitDetailHeader habit={detail.habit} backHref={backHref} />
      <HabitDetailTabs activeTab={activeTab} onChange={onChangeTab} />
      {activeTab === "log" ? (
        <HabitDetailLogTab
          habit={detail.habit}
          entries={detail.entries}
          todayQuantity={detail.todayQuantity}
          targetQuantity={detail.targetQuantity}
        />
      ) : (
        <HabitDetailStatsTab stats={detail.stats} />
      )}
      <HabitDetailTabs activeTab={activeTab} onChange={onChangeTab} />
    </div>
  )
}
