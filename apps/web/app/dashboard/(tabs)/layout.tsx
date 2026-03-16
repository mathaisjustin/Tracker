"use client"

import { usePathname } from "next/navigation"
import BottomNav from "@/components/dashboard/BottomNav"

export default function DashboardTabsLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname()

  const HIDDEN_ROUTES = [
    "/dashboard/habits/create",
  ]

  const hideBottomNav =
    HIDDEN_ROUTES.some(route => pathname.startsWith(route)) ||
    pathname.startsWith("/dashboard/habits/") && pathname !== "/dashboard/habits"

  return (

    <div className="min-h-screen bg-black text-white">

      <div className={hideBottomNav ? "p-4" : "pb-24 p-4"}>
        {children}
      </div>

      {!hideBottomNav && <BottomNav />}

    </div>

  )
}