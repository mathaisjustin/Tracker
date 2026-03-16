"use client"

type EntryStatus = "complete" | "partial" | "missed" | "progress"

type LogEntry = {
  date: string
  value: number
  unit?: string
  status: EntryStatus
}

type LogsHistoryCardProps = {
  entries: LogEntry[]
}

const statusStyles: Record<EntryStatus, string> = {
  complete: "bg-green-500/10 text-green-400",
  partial: "bg-yellow-500/10 text-yellow-400",
  missed: "bg-red-500/10 text-red-400",
  progress: "bg-zinc-800 text-zinc-400",
}

const statusLabel: Record<EntryStatus, string> = {
  complete: "Complete",
  partial: "Partial",
  missed: "Missed",
  progress: "In progress",
}

export function LogsHistoryCard({ entries }: LogsHistoryCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">

      {/* Title */}
      <p className="text-xs tracking-widest text-zinc-500 mb-4">
        RECENT ENTRIES
      </p>

      <div className="divide-y divide-zinc-800">

        {entries.map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-4"
          >
            {/* Date */}
            <p className="text-sm text-zinc-400">{entry.date}</p>

            {/* Value */}
            <p className="font-semibold">
              {entry.value} {entry.unit ?? "cups"}
            </p>

            {/* Status */}
            <span
              className={`rounded-full px-3 py-1 text-xs ${statusStyles[entry.status]}`}
            >
              {statusLabel[entry.status]}
            </span>
          </div>
        ))}

      </div>

    </div>
  )
}