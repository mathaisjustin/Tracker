"use client"

type View = "logs" | "stats"

interface HabitDetailsSwitchProps {
  view: View
  onChange: (view: View) => void
}

export function HabitDetailsSwitch({ view, onChange }: HabitDetailsSwitchProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">

      {/* Full bottom block */}
      <div className="bg-black border-t border-zinc-800 flex justify-center py-4">

        {/* Switch container */}
        <div className="flex rounded-full bg-zinc-900 p-1 gap-5">

          <button
            onClick={() => onChange("logs")}
            className={`px-8 py-2 rounded-full text-sm font-medium transition ${
              view === "logs"
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Logs
          </button>

          <button
            onClick={() => onChange("stats")}
            className={`px-8 py-2 rounded-full text-sm font-medium transition ${
              view === "stats"
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Stats
          </button>

        </div>

      </div>

    </div>
  )
}