"use client"

type LogsProgressCardProps = {
  title: string
  goalLabel: string
  progress: number
  goal: number
  unit?: string
}

export function LogsProgressCard({
  title,
  goalLabel,
  progress,
  goal,
  unit,
}: LogsProgressCardProps) {

  const hasGoal = goal !== null && goal !== undefined && goal > 0
  const SOFT_LIMIT = 10 // you can tweak this later

  const percent = hasGoal
    ? Math.min((progress / goal) * 100, 100)
    : Math.min((progress / SOFT_LIMIT) * 100, 100)

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">

      {/* Top row */}
      <div className="flex items-start">

        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {hasGoal && goalLabel && (
            <p className="text-sm text-zinc-400">{goalLabel}</p>
          )}
        </div>

      </div>

      {/* Progress bar */}
      <div className="space-y-2">

        <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{
              width: `${percent}%`,
            }}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between text-xs text-zinc-500">
          <span>
            {progress} {progress === 1 ? unit : `${unit}s`} today
          </span>

          {hasGoal && (
            <span>
              {goal} {goal === 1 ? unit : `${unit}s`} goal
            </span>
          )}
        </div>

      </div>

    </div>
  )
}