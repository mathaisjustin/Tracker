"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CirclePlus, ScrollText, Settings } from "lucide-react"

export default function BottomNav() {

  const pathname = usePathname()

  const tabs = [
    {
      href: "/dashboard/habits",
      icon: CirclePlus,
    },
    {
      href: "/dashboard/stats",
      icon: ScrollText,
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (

    <div className="fixed bottom-6 left-0 w-full flex justify-center z-50">

      <div className="bg-black/90 backdrop-blur-md border border-zinc-800 rounded-full px-8 py-3 flex items-center gap-10 shadow-lg">

        {tabs.map((tab) => {

          const Icon = tab.icon
          const active = pathname === tab.href

          return (

            <Link
              key={tab.href}
              href={tab.href}
              className="flex items-center justify-center"
            >
              <Icon
                size={26}
                className={active ? "text-white" : "text-zinc-500"}
              />
            </Link>

          )

        })}

      </div>

    </div>

  )
}