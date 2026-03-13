"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthProvider"

export default function Home() {

  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {

    if (loading) return

    if (user) {
      router.replace("/dashboard")
    } else {
      router.replace("/login")
    }

  }, [user, loading])

  return null
}