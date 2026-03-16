"use client"

type StatItem = {
  label: string
  value: string | number
  sub?: string
}

type Props = {
  stats: StatItem[]
}

export default function StatsOverviewCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">

      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5"
        >
          <p className="text-xs tracking-widest text-zinc-500 uppercase">
            {stat.label}
          </p>

          <p className="text-3xl font-semibold mt-2">
            {stat.value}
          </p>

          {stat.sub && (
            <p className="text-sm text-zinc-400 mt-1">
              {stat.sub}
            </p>
          )}
        </div>
      ))}

    </div>
  )
}