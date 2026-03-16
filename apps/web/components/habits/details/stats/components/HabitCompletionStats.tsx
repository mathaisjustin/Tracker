"use client"

export type HabitStat = {
  name: string
  percent: number
  color?: "green" | "yellow" | "red"
}

type Props = {
  title?: string
  habits: HabitStat[]
}

const colorMap = {
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  red: "bg-red-400",
}

export default function HabitCompletionStats({ title, habits }: Props) {

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">

      {title && (
        <p className="text-xs tracking-widest text-zinc-500 uppercase">
          {title}
        </p>
      )}

      <div className="space-y-4">

        {habits.map((habit, index) => {

          const color = colorMap[habit.color || "green"]

          return (
            <div key={index} className="space-y-1">

              <div className="flex justify-between text-sm text-zinc-300">
                <span>{habit.name}</span>
                <span className="text-zinc-400">{habit.percent}%</span>
              </div>

              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${habit.percent}%` }}
                />
              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}