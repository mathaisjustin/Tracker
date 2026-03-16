"use client"

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

type TrendData = {
  day: string
  meditate: number
  walk: number
  water: number
  read: number
}

interface TrendChartProps {
  data: TrendData[]
}

export default function TrendChart({ data }: TrendChartProps) {

  return (

    <div className="mt-8">

      <div className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 rounded-3xl p-6">

        {/* Title */}

        <p className="text-xs tracking-[0.35em] text-zinc-500 mb-6">
          7-DAY TREND — ALL HABITS
        </p>


        <div className="h-44">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={data}>

              <XAxis
                dataKey="day"
                stroke="#71717a"
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "10px"
                }}
              />

              <Line
                type="monotone"
                dataKey="meditate"
                stroke="#d4d4d8"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="walk"
                stroke="#a1a1aa"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="water"
                stroke="#facc15"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="read"
                stroke="#f87171"
                strokeWidth={2}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>


        {/* Legend */}

        <div className="flex gap-6 mt-4 text-xs text-zinc-500">

          <LegendItem color="bg-zinc-300" label="Meditate" />
          <LegendItem color="bg-zinc-400" label="Walk" />
          <LegendItem color="bg-yellow-400" label="Water" />
          <LegendItem color="bg-red-400" label="Read" />

        </div>

      </div>

    </div>

  )

}

function LegendItem({ color, label }: { color: string, label: string }) {

  return (

    <div className="flex items-center gap-2">

      <div className={`w-4 h-[2px] ${color}`} />

      <span>{label}</span>

    </div>

  )

}