"use client"

import { useMemo } from "react"

type CalendarProgress = {
  date: string
  progress: number
}

type Props = {
  data: CalendarProgress[]
  habitName?: string
}

function getWeeklyScores(data: CalendarProgress[]): number[] {
  if (!data.length) return Array(10).fill(0)

  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date))
  const weeks: CalendarProgress[][] = []
  let week: CalendarProgress[] = []

  sorted.forEach((entry, i) => {
    week.push(entry)
    if (week.length === 7 || i === sorted.length - 1) {
      weeks.push(week)
      week = []
    }
  })

  const last10 = weeks.slice(-10)

  return last10.map((w) => {
    const avg = w.reduce((sum, d) => sum + d.progress, 0) / w.length
    return Math.round(avg)
  })
}

function computeMomentumScore(weeklyScores: number[]): number {
  if (!weeklyScores.length) return 0
  const weights = weeklyScores.map((_, i) => i + 1)
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  const weighted = weeklyScores.reduce((sum, score, i) => sum + score * weights[i], 0)
  return Math.min(100, Math.round(weighted / totalWeight))
}

function getBestWeek(data: CalendarProgress[], weeklyScores: number[]) {
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date))
  const weeks: CalendarProgress[][] = []
  let week: CalendarProgress[] = []

  sorted.forEach((entry, i) => {
    week.push(entry)
    if (week.length === 7 || i === sorted.length - 1) {
      weeks.push(week)
      week = []
    }
  })

  const last10 = weeks.slice(-10)
  const maxScore = Math.max(...weeklyScores)
  const bestIdx = weeklyScores.indexOf(maxScore)
  const bestWeekData = last10[bestIdx]

  if (!bestWeekData?.length) return { score: maxScore, label: "—" }

  const startDate = bestWeekData[0].date
  const d = new Date(startDate)
  const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })

  return { score: maxScore, label: `Week of ${label}` }
}

function MiniSparkline({ scores }: { scores: number[] }) {
  const max = Math.max(...scores, 1)
  const width = 240
  const height = 48
  const pad = 4

  const points = scores.map((s, i) => {
    const x = pad + (i / (scores.length - 1)) * (width - pad * 2)
    const y = height - pad - (s / max) * (height - pad * 2)
    return `${x},${y}`
  })

  const polyline = points.join(" ")

  const firstX = pad
  const lastX = width - pad
  const fillPoints = `${firstX},${height} ${polyline} ${lastX},${height}`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ height: 48 }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e91e8c" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#e91e8c" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill="url(#spark-fill)" />
      <polyline
        points={polyline}
        fill="none"
        stroke="#e91e8c"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {scores.map((s, i) => {
        const x = pad + (i / (scores.length - 1)) * (width - pad * 2)
        const y = height - pad - (s / max) * (height - pad * 2)
        const isLast = i === scores.length - 1
        return isLast ? (
          <circle key={i} cx={x} cy={y} r={3} fill="#e91e8c" />
        ) : null
      })}
    </svg>
  )
}

function ScoreRing({ score }: { score: number }) {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
      <svg
        className="absolute inset-0 -rotate-90"
        width="80"
        height="80"
        viewBox="0 0 80 80"
      >
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#27272a"
          strokeWidth="6"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#e91e8c"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col items-center leading-none z-10">
        <span className="text-xl font-bold text-white">{score}</span>
        <span className="text-[10px] text-zinc-500 mt-0.5">/ 100</span>
      </div>
    </div>
  )
}

export default function MomentumScore({ data, habitName }: Props) {
  const weeklyScores = useMemo(() => getWeeklyScores(data), [data])
  const score = useMemo(() => computeMomentumScore(weeklyScores), [weeklyScores])
  const prevScore = weeklyScores[weeklyScores.length - 2] ?? score
  const delta = score - prevScore
  const bestWeek = useMemo(() => getBestWeek(data, weeklyScores), [data, weeklyScores])

  const trend =
    delta > 0
      ? { label: `+${delta} from last week`, color: "text-emerald-400", arrow: "↑" }
      : delta < 0
      ? { label: `${delta} from last week`, color: "text-red-400", arrow: "↓" }
      : { label: "Same as last week", color: "text-zinc-500", arrow: "→" }

  return (
    <div className="bg-zinc-900 rounded-xl p-4 space-y-4">

      {/* Header */}
      <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">
        Momentum score
      </p>

      {/* Score row */}
      <div className="flex items-center gap-4">
        <ScoreRing score={score} />
        <div className="flex flex-col gap-1">
          <span className={`text-sm font-semibold ${trend.color}`}>
            {trend.arrow} {trend.label}
          </span>
          <span className="text-xs text-zinc-600 leading-relaxed">
            Weighted by recency across the last 10 weeks
          </span>
        </div>
      </div>

      {/* Sparkline */}
      <div className="space-y-1">
        <MiniSparkline scores={weeklyScores} />
        <div className="flex justify-between text-[10px] text-zinc-600">
          <span>10 weeks ago</span>
          <span>5 weeks ago</span>
          <span>This week</span>
        </div>
      </div>

      {/* Best week badge */}
      <div className="flex items-center gap-2 bg-zinc-800 rounded-full px-3 py-1.5 w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-[#e91e8c] flex-shrink-0" />
        <span className="text-xs text-[#e91e8c]">
          Personal best: {bestWeek.score} · {bestWeek.label}
        </span>
      </div>

    </div>
  )
}