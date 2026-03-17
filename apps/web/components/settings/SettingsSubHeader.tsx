"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SettingsSubHeader({
  title,
  right,
}: {
  title: string
  right?: React.ReactNode
}) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between mb-6">
      
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      {/* RIGHT */}
      {right}
    </div>
  )
}