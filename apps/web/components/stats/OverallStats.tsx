"use client"

interface OverallStatsProps {
  overallRate: number
  perfectDays: number
  bestStreak: number
  totalEntries: number
  activeStreaks: number
}

export default function OverallStats({
  overallRate,
  perfectDays,
  bestStreak,
  totalEntries,
  activeStreaks,
}: OverallStatsProps) {

  return (

    <div className="mt-8">

      {/* Outer Card */}

      <div className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 rounded-3xl p-6">

        {/* Section Title */}

        <p className="text-xs tracking-[0.35em] text-zinc-500 mb-6">
          THIS MONTH AT A GLANCE
        </p>

        <div className="grid grid-cols-3 gap-4">

          <StatCard
            value={
              <>
                {overallRate}
                <span className="text-xl text-zinc-400">%</span>
              </>
            }
            label="OVERALL"
          />

          <StatCard
            value={perfectDays}
            label="PERFECT DAYS"
          />

          <StatCard
            value={bestStreak}
            label="BEST STREAK"
          />

          <StatCard
            value={totalEntries}
            label="TOTAL ENTRIES"
            span={2}
          />

          <StatCard
            value={
              <span className="flex items-center gap-2">
                🔥
                <span className="text-green-400">{activeStreaks}</span>
              </span>
            }
            label="ACTIVE STREAKS"
          />

        </div>

      </div>

    </div>

  )
}


interface StatCardProps {
  value: React.ReactNode
  label: string
  span?: number
}

function StatCard({ value, label, span = 1 }: StatCardProps) {

  return (

    <div
      className={`
        bg-zinc-800/40
        rounded-3xl
        h-28
        flex
        flex-col
        items-center
        justify-center
        text-center
        ${span === 2 ? "col-span-2" : ""}
      `}
    >

      <div className="text-3xl font-semibold tracking-tight">
        {value}
      </div>

      <div className="text-[10px] text-zinc-500 tracking-[0.25em] mt-2">
        {label}
      </div>

    </div>

  )
}