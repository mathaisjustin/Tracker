"use client"

type HabitDayStat = {
  name: string
  strongest: string
  weakest: string
}

interface BestWorstDaysProps {
  habits: HabitDayStat[]
}

export default function BestWorstDays({ habits }: BestWorstDaysProps) {

  return (

    <div className="mt-8">

      <div className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 rounded-3xl p-6">

        {/* Title */}

        <p className="text-xs tracking-[0.35em] text-zinc-500 mb-6">
          BEST & WORST DAY — PER HABIT
        </p>


        <div className="grid grid-cols-2 gap-4">

          {habits.map((habit) => (

            <div
              key={habit.name}
              className="bg-zinc-800/40 rounded-2xl p-5"
            >

              {/* Habit Name */}

              <p className="text-zinc-300 mb-4 font-medium">
                {habit.name}
              </p>


              {/* Days */}

              <div className="flex justify-between">

                <div>

                  <p className="text-green-400 font-semibold">
                    {habit.strongest}
                  </p>

                  <p className="text-xs text-zinc-500">
                    strongest
                  </p>

                </div>


                <div className="text-right">

                  <p className="text-red-400 font-semibold">
                    {habit.weakest}
                  </p>

                  <p className="text-xs text-zinc-500">
                    weakest
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}