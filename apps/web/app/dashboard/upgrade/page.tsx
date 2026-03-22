"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function UpgradePage() {
  const router = useRouter()

  const handleUpgrade = () => {
    alert("🚧 Dummy payment successful!\n(Pro unlocked locally)")
    router.push("/dashboard/habits")
  }

  return (
    <div className="min-h-screen bg-black text-white px-5 py-8 flex flex-col gap-8">
      
      {/* HEADER */}
      <div className="space-y-3">
        <div className="inline-block px-3 py-1 text-xs rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
          ✦ Habit Tracker Pro
        </div>

        <h1 className="text-3xl font-bold leading-tight">
          Build habits that{" "}
          <span className="text-pink-500 italic">actually stick</span>
        </h1>

        <p className="text-zinc-400 text-sm">
          Unlock unlimited habits, advanced stats, and streak protection.
        </p>
      </div>

      {/* MONTHLY PLAN */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-xs text-zinc-500 uppercase">Monthly</p>
          <div className="size-4 rounded-full border border-zinc-600" />
        </div>

        <p className="text-2xl font-bold">₹99 / month</p>

        <ul className="text-sm text-zinc-400 space-y-2">
          <li>✔ Unlimited habits</li>
          <li>✔ Full stats & heatmaps</li>
          <li>✔ Streak protection</li>
          <li>✔ CSV export</li>
        </ul>
      </div>

      {/* YEARLY PLAN (highlighted) */}
      <div className="rounded-xl border border-pink-500 bg-zinc-900 p-5 space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-xs text-pink-400 uppercase">Yearly</p>
          <span className="text-xs bg-pink-500 text-black px-2 py-0.5 rounded-full">
            Most Popular
          </span>
        </div>

        <p className="text-2xl font-bold">₹199 / month</p>

        <ul className="text-sm text-zinc-400 space-y-2">
          <li>✔ Everything in Monthly</li>
          <li>✔ Priority support</li>
          <li>✔ Early features</li>
          <li>✔ Extra grace days</li>
        </ul>
      </div>

      {/* CTA */}
      <Button
        onClick={handleUpgrade}
        className="w-full py-6 text-base font-semibold"
      >
        ✨ Start 7-day free trial
      </Button>

      {/* FOOTER */}
      <div className="text-center text-xs text-zinc-500 space-y-1">
        <p>No charge until trial ends • Cancel anytime</p>
        <p>🔒 Secure payment • ⚡ Instant access</p>
      </div>

      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="text-sm text-zinc-500 hover:text-white text-center mt-2"
      >
        ← Go back
      </button>
    </div>
  )
}