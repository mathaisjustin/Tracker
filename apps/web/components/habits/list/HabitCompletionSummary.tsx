interface HabitCompletionSummaryProps {
  completed: number
  total: number
}

export function HabitCompletionSummary({
  completed,
  total,
}: HabitCompletionSummaryProps) {
  return (
    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
      {completed} of {total} completed today
    </p>
  )
}
