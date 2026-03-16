"use client"

type Props = {
  title?: string
  weeks: number[][]
}

const intensityMap = [
  "bg-zinc-900",
  "bg-zinc-800",
  "bg-zinc-700",
  "bg-zinc-600",
  "bg-zinc-300",
]

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

export default function OverallActivityHeatmap({ title, weeks }: Props) {

  return (

    <div className="mt-8">

      <div className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 rounded-3xl p-6 space-y-5">

        {/* Title */}

        {title && (
          <p className="text-xs tracking-[0.35em] text-zinc-500">
            {title}
          </p>
        )}


        {/* Heatmap */}

        <div className="flex gap-3">

          {/* Day Labels */}

            <div className="flex flex-col gap-[6px] text-xs text-zinc-500">
                {days.map((d) => (
                    <div key={d} className="h-[14px] flex items-center">
                    {d}
                    </div>
                ))}
            </div>


          {/* Activity Grid */}

          <div className="flex flex-col gap-[6px]">

            {weeks.map((week, w) => (

              <div key={w} className="flex gap-[6px]">

                {week.map((value, d) => (

                  <div
                    key={d}
                    className={`w-[14px] h-[14px] rounded-[3px] ${intensityMap[value]}`}
                  />

                ))}

              </div>

            ))}

          </div>

        </div>


        {/* Legend */}

        <div className="flex items-center gap-2 text-xs text-zinc-500 pt-1">

          <span>Less</span>

          {intensityMap.map((c, i) => (
            <div key={i} className={`w-[12px] h-[12px] rounded ${c}`} />
          ))}

          <span>More</span>

          <span className="ml-2 text-zinc-600">
            · habits done/day
          </span>

        </div>

      </div>

    </div>

  )

}