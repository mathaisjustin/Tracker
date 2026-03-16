"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

type HabitDetailsHeaderProps = {
  name: string
  onArchive?: () => void
}

export function HabitDetailsHeader({ name, onArchive }: HabitDetailsHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">

      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-xl font-semibold">{name}</h1>
      </div>

      {/* Right */}
      <button
        onClick={onArchive}
        className="text-zinc-400 hover:text-white transition"
      >
        Archive
      </button>

    </div>
  )
}