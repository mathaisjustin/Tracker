"use client"

import { useAuth } from "@/lib/AuthProvider"

export default function AuthGate({
  children,
}: {
  children: React.ReactNode
}) {

  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading Tracker...
      </div>
    )
  }

  return <>{children}</>
}