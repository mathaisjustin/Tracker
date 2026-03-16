import type { HabitStatsModel } from "./types"

interface HabitDetailStatsTabProps {
  stats: HabitStatsModel
}

export function HabitDetailStatsTab({ stats }: HabitDetailStatsTabProps) {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">March 2026</p>
        <div className="mt-3 grid grid-cols-4 gap-3">
          <StatCard label="Best Streak" value={String(stats.bestStreak)} sub="days" />
          <StatCard label="Total Logged" value={String(stats.totalLogged)} sub="all time" />
          <StatCard label="Perfect Days" value={String(stats.perfectDays)} sub="goal hit" />
          <StatCard label="Avg / Day" value={stats.averagePerDay.toFixed(1)} sub="cups this month" />
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Last 7 Days vs Goal</p>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {stats.last7Days.map((point) => (
            <div key={point.day} className="flex flex-col items-center gap-1">
              <span
                className={`h-16 w-2 rounded-full ${
                  point.status === "goal"
                    ? "bg-emerald-400"
                    : point.status === "partial"
                      ? "bg-amber-400"
                      : "bg-rose-400"
                }`}
                style={{ opacity: Math.max(0.35, Math.min(1, point.quantity / 8)) }}
              />
              <span className="text-xs text-zinc-400">{point.day}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Activity Heatmap - 10 Weeks</p>
        <div className="mt-3 space-y-2">
          {stats.heatmap.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((cell, cellIndex) => (
                <span
                  key={`${rowIndex}-${cellIndex}`}
                  className={`size-3 rounded-sm ${cell === "high" ? "bg-zinc-100" : cell === "mid" ? "bg-zinc-400" : cell === "low" ? "bg-zinc-700" : "bg-zinc-900"}`}
                />
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-black/30 p-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      <p className="text-xs text-zinc-400">{sub}</p>
    </div>
  )
}
