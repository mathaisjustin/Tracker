import { format, isToday, isYesterday, isTomorrow, differenceInCalendarDays } from "date-fns"

interface HabitsHeaderProps {
  date: Date
}

function getDateLabel(date: Date): string {
  if (isToday(date)) return "Today"
  if (isYesterday(date)) return "Yesterday"
  if (isTomorrow(date)) return "Tomorrow"
  return format(date, "EEEE, MMMM d")
}

export function HabitsHeader({ date }: HabitsHeaderProps) {
  return (
    <header>
      <h1 className="text-2xl font-bold text-white">{getDateLabel(date)}</h1>
    </header>
  )
}