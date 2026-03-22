"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { CirclePlus, ScrollText, Settings } from "lucide-react"
import { useProfile } from "@/hooks/useProfile"
import { cn } from "@/lib/utils"

export default function BottomNav() {
  const { canCreate } = useProfile()

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isHabitsPage = pathname === "/dashboard/habits"

  const selectedDate = searchParams.get("date")
  const createHref = selectedDate
    ? `/dashboard/habits/create?date=${encodeURIComponent(selectedDate)}`
    : "/dashboard/habits/create"

  const plusHref = isHabitsPage
    ? (canCreate ? createHref : "/dashboard/upgrade")
    : "/dashboard/habits"

  const tabs = [
    { key: "habits", href: plusHref, isHabits: true },
    { key: "stats", href: "/dashboard/stats", isHabits: false },
    { key: "settings", href: "/dashboard/settings", isHabits: false },
  ]

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full h-[64px] bg-black z-40" />
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
                // on habits page: plus button, yellow if upgrade needed
                <CirclePlus
                  size={26}
                  className={canCreate ? iconClass : "text-yellow-400"}
                />
              ) : isFirst ? (
                <FontAwesomeIcon icon={faHouse} className={cn(iconClass, "text-xl")} />
              ) : tab.href === "/dashboard/stats" ? (
                <ScrollText size={26} className={iconClass} />
              ) : (
                <Settings size={26} className={iconClass} />
              )

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