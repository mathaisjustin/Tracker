"use client"

import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SettingsProfile() {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push("/dashboard/settings/profile")}
      className="flex items-center justify-between px-4 py-5 cursor-pointer hover:bg-zinc-900 transition"
    >
      
      <div className="flex items-center gap-4">
        
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center font-semibold">
          JM
        </div>

        {/* Text */}
        <div>
          <p className="text-white font-medium">Justin Mathias</p>
          <p className="text-zinc-400 text-sm">justinm@gmail.com</p>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-zinc-500" />
    </div>
  )
}