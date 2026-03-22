"use client"

type Props = {
  title?: string
  weeks: number[][]
}

const intensityMap = [
  "bg-zinc-800",
  "bg-zinc-700",
  "bg-zinc-600",
  "bg-zinc-500",
  "bg-zinc-300",
]

export default function ActivityHeatmap({ title, weeks }: Props) {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3">

      {title && (
        <p className="text-xs tracking-widest text-zinc-500 uppercase">
          {title}
        </p>
      )}

      {/* Heatmap */}

<div className="flex flex-row gap-[4px] w-full">
  {weeks.map((week, w) => (
    <div key={w} className="flex flex-col gap-[4px] flex-1">
      {week.map((value, d) => (
        <div
          key={d}
          className={`aspect-square w-full rounded-[3px] ${intensityMap[value]}`}
        />
      ))}
    </div>
  ))}
</div>

      {/* Legend */}

      <div className="flex items-center gap-2 text-xs text-zinc-500 pt-1">

        <span>Less</span>

        {intensityMap.map((c, i) => (
          <div key={i} className={`w-[12px] h-[12px] rounded ${c}`} />
        ))}

        <span>More</span>

      </div>

    </div>
  )
}