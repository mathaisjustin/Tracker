import { format } from "date-fns"

interface HabitsHeaderProps {
  date: Date
  title?: string
}

export function HabitsHeader({ date, title = "Today" }: HabitsHeaderProps) {
  const formattedDate = format(date, "EEEE, MMMM d")

  return (
    <header>
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="mt-1 text-sm text-zinc-400">{formattedDate}</p>
    </header>
  )
}
