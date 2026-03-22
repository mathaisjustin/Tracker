"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { CirclePlus, ScrollText, Settings } from "lucide-react"
import { useHabits } from "@/hooks/useHabits"
import { useProfile } from "@/hooks/useProfile"
import { cn } from "@/lib/utils"

export default function BottomNav() {
const { habits } = useHabits()
const { isPro } = useProfile()

const canCreate = isPro || habits.length < 2

const pathname = usePathname()
const searchParams = useSearchParams()
const isHabitsPage = pathname === "/dashboard/habits"

const selectedDate = searchParams.get("date")
const createHref = selectedDate
? `/dashboard/habits/create?date=${encodeURIComponent(selectedDate)}`
: "/dashboard/habits/create"

const habitsTab = {
key: "habits",
href: isHabitsPage ? createHref : "/dashboard/habits",
isHabits: true,
}

const statsTab = { key: "stats", href: "/dashboard/stats", isHabits: false }
const settingsTab = { key: "settings", href: "/dashboard/settings", isHabits: false }

const tabs = [habitsTab, statsTab, settingsTab]

return (
<>
{/* BACKGROUND LAYER */} <div className="fixed bottom-0 left-0 w-full h-[64px] bg-black z-40" />
  {/* NAV */}
  <div className="fixed bottom-0 left-0 w-full h-[64px] flex items-center justify-center z-50">
    <div className="bg-black/90 backdrop-blur-md border border-zinc-800 rounded-full px-8 py-3 flex items-center gap-10 shadow-lg">
      {tabs.map((tab) => {
        const isFirst = tab.isHabits

        const active = isFirst
          ? pathname === "/dashboard/habits"
          : pathname === tab.href

        const iconClass = active ? "text-white" : "text-zinc-500"

        const content =
          isFirst && isHabitsPage ? (
            <CirclePlus size={26} className={iconClass} />
          ) : isFirst ? (
            <FontAwesomeIcon icon={faHouse} className={cn(iconClass, "text-xl")} />
          ) : tab.href === "/dashboard/stats" ? (
            <ScrollText size={26} className={iconClass} />
          ) : (
            <Settings size={26} className={iconClass} />
          )

        // 🔥 MAIN LOGIC
        if (isFirst && isHabitsPage) {
          const targetHref = canCreate
            ? createHref
            : "/dashboard/upgrade"

          return (
            <Link
              key={tab.key}
              href={targetHref}
              className={cn(
                "flex items-center justify-center",
                !canCreate && "text-yellow-400"
              )}
              title={!canCreate ? "Upgrade to Pro" : undefined}
            >
              {content}
            </Link>
          )
        }

        // ✅ Normal tabs
        return (
          <Link
            key={tab.key}
            href={tab.href}
            className="flex items-center justify-center"
          >
            {content}
          </Link>
        )
      })}
    </div>
  </div>
</>
)
}
