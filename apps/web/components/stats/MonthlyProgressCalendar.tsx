"use client"

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth
} from "date-fns"

type CalendarProgress = {
  date: string
  progress: number
}

type Props = {
  data: CalendarProgress[]
  month: Date
}

export default function MonthlyProgressCalendar({ data, month }: Props) {

  const startMonth = startOfMonth(month)
  const endMonth = endOfMonth(startMonth)

  const startDate = startOfWeek(startMonth)
  const endDate = endOfWeek(endMonth)

  const rows = []
  let days = []
  let day = startDate

  while (day <= endDate) {

    for (let i = 0; i < 7; i++) {

      const formattedDate = format(day, "yyyy-MM-dd")

      const progress =
        data.find((d) => d.date === formattedDate)?.progress || 0

      days.push(
        <div
          key={day.toString()}
          className="flex justify-center items-center"
        >

          <div
            className={`relative w-10 h-10 flex items-center justify-center rounded-full text-sm
              ${!isSameMonth(day, startMonth) ? "text-zinc-600" : "text-white"}
            `}
          >

            {progress > 0 && (
              <svg
                className="absolute inset-0"
                viewBox="0 0 36 36"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#27272a"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="3"
                  strokeDasharray={`${progress}, 100`}
                  transform="rotate(-90 18 18)"
                />
              </svg>
            )}

            <span>{format(day, "d")}</span>

          </div>

        </div>
      )

      day = addDays(day, 1)
    }

    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-2">
        {days}
      </div>
    )

    days = []
  }

  return (

    <div className="bg-zinc-900 rounded-xl p-4 space-y-4">

      {/* Week Days */}

      <div className="grid grid-cols-7 text-xs text-zinc-500 text-center">
        <p>M</p>
        <p>T</p>
        <p>W</p>
        <p>T</p>
        <p>F</p>
        <p>S</p>
        <p>S</p>
      </div>

      {/* Calendar */}

      <div className="space-y-2">
        {rows}
      </div>

    </div>
  )
}