"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

type LogsHeaderProps = {
  name: string
  onArchive?: () => void
}

export function LogsHeader({ name, onArchive }: LogsHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between border-b border-zinc-800 pb-4">

      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">{name}</h1>
        </div>
      </div>

      {/* Right section */}
      <button
        onClick={onArchive}
        className="text-zinc-400 hover:text-white transition"
      >
        Archive
      </button>

    </div>
  )
}