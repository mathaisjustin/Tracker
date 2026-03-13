"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthProvider"

const authRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password"
]

export default function AppRouterGuard({
  children
}: {
  children: React.ReactNode
}) {

  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {

    if (loading) return

    const isAuthRoute = authRoutes.includes(pathname)

    // Not logged in
    if (!user) {
      if (!isAuthRoute) {
        router.replace("/login")
      }
      return
    }

    // Logged in but onboarding not complete
    if (user && !profile?.onboarding_completed) {
      if (pathname !== "/onboarding") {
        router.replace("/onboarding")
      }
      return
    }

    // Logged in + onboarded
    if (user && profile?.onboarding_completed) {

      if (isAuthRoute || pathname === "/onboarding") {
        router.replace("/dashboard")
      }

    }

  }, [user, profile, loading, pathname, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading Tracker...
      </div>
    )
  }

  return <>{children}</>
}