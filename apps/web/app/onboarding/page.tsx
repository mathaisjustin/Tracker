"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthProvider"
import { completeOnboarding } from "@/lib/api/profile"

export default function OnboardingPage() {

  const { user, refreshProfile } = useAuth()
  const router = useRouter()

  const [saving, setSaving] = useState(false)

  async function handleFinish() {

    if (!user) return

    setSaving(true)

    try {

      await completeOnboarding()

      await refreshProfile()

      router.replace("/dashboard")

    } catch (err) {

      console.error(err)

    }

    setSaving(false)
  }

  return (

    <div className="flex min-h-screen items-center justify-center">

      <div className="text-center space-y-6">

        <h1 className="text-3xl font-bold">
          Welcome 🎉
        </h1>

        <p className="text-muted-foreground">
          Let's finish setting up your account.
        </p>

        <button
          onClick={handleFinish}
          disabled={saving}
          className="px-6 py-3 bg-black text-white rounded-lg"
        >
          {saving ? "Setting up..." : "Finish Setup"}
        </button>

      </div>

    </div>

  )
}