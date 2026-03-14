"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { CirclePlus, ScrollText, Settings } from "lucide-react"

import { cn } from "@/lib/utils"

export default function BottomNav() {
  const pathname = usePathname()
  const isHabitsPage = pathname === "/dashboard/habits"

  const habitsTab = {
    key: "habits",
    href: isHabitsPage ? "/dashboard/habits/create" : "/dashboard/habits",
    isHabits: true,
  }
  const statsTab = { key: "stats", href: "/dashboard/stats", isHabits: false }
  const settingsTab = { key: "settings", href: "/dashboard/settings", isHabits: false }

  const tabs = [habitsTab, statsTab, settingsTab]

  return (
    <div className="fixed bottom-6 left-0 w-full flex justify-center z-50">
      <div className="bg-black/90 backdrop-blur-md border border-zinc-800 rounded-full px-8 py-3 flex items-center gap-10 shadow-lg">
        {tabs.map((tab) => {
          const isFirst = tab.isHabits
          const active = isFirst
            ? pathname === "/dashboard/habits"
            : pathname === tab.href
          const iconClass = active ? "text-white" : "text-zinc-500"

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className="flex items-center justify-center"
            >
              {isFirst && isHabitsPage ? (
                <CirclePlus size={26} className={iconClass} />
              ) : isFirst ? (
                <FontAwesomeIcon icon={faHouse} className={cn(iconClass, "text-xl")} />
              ) : tab.href === "/dashboard/stats" ? (
                <ScrollText size={26} className={iconClass} />
              ) : (
                <Settings size={26} className={iconClass} />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}