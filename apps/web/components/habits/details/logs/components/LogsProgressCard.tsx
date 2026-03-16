"use client"

type LogsProgressCardProps = {
  title: string
  goalLabel: string
  progress: number
  goal: number
  streak: number
}

export function LogsProgressCard({
  title,
  goalLabel,
  progress,
  goal,
  streak,
}: LogsProgressCardProps) {

  const percent = Math.min((progress / goal) * 100, 100)

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">

      {/* Top row */}
      <div className="flex items-start justify-between">

        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-zinc-400">{goalLabel}</p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-sm text-green-400">
          🔥 {streak} day streak
        </div>

      </div>

      {/* Progress bar */}
      <div className="space-y-2">

        <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between text-xs text-zinc-500">
          <span>{progress} cups today</span>
          <span>{goal} cups goal</span>
        </div>

      </div>

    </div>
  )
}