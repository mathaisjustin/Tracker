"use client"

import { ChevronRight } from "lucide-react"
import { ReactNode } from "react"

type Props = {
  icon?: ReactNode
  title: string
  subtitle?: string
  right?: ReactNode
  onClick?: () => void
}

export default function SettingsItem({
  icon,
  title,
  subtitle,
  right,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-zinc-900 transition"
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
            {icon}
          </div>
        )}

        <div>
          <p className="text-white text-sm font-medium">{title}</p>
          {subtitle && (
            <p className="text-zinc-400 text-xs mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-zinc-400">
        {right ?? <ChevronRight className="w-4 h-4" />}
      </div>
    </div>
  )
}