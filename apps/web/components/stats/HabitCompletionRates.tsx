"use client"

type HabitRate = {
  name: string
  percent: number
  color?: string
}

interface HabitCompletionRatesProps {
  habits: HabitRate[]
}

export default function HabitCompletionRates({ habits }: HabitCompletionRatesProps) {

  return (

    <div className="mt-8">

      <div className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 rounded-3xl p-6">

        {/* Title */}

        <p className="text-xs tracking-[0.35em] text-zinc-500 mb-6">
          COMPLETION RATE — PER HABIT
        </p>


        <div className="space-y-5">

          {habits.map((habit) => {

            const color =
              habit.color ??
              (habit.percent >= 80
                ? "bg-zinc-200"
                : habit.percent >= 60
                ? "bg-yellow-400"
                : "bg-red-400")

            const percentColor =
              habit.percent >= 80
                ? "text-zinc-300"
                : habit.percent >= 60
                ? "text-yellow-400"
                : "text-red-400"

            return (

              <div key={habit.name} className="flex items-center gap-4">

                {/* Name */}

                <div className="w-24 text-zinc-200">
                  {habit.name}
                </div>


                {/* Progress Bar */}

                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">

                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${habit.percent}%` }}
                  />

                </div>


                {/* Percent */}

                <div className={`w-10 text-right ${percentColor}`}>
                  {habit.percent}%
                </div>

              </div>

            )

          })}

        </div>

      </div>

    </div>

  )

}