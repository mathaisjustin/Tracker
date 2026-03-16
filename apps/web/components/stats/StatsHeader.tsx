"use client"

import { ChevronDown, Plus } from "lucide-react"

type Habit = {
  id: string
  name: string
  icon: string
}

type Props = {
  habits: Habit[]
  selectedHabit: string | null
  onSelectHabit: (id: string | null) => void
}

export default function StatsHeader({
  habits,
  selectedHabit,
  onSelectHabit,
}: Props) {

  const title =
    selectedHabit === null
      ? "Overall"
      : habits.find(h => h.id === selectedHabit)?.name

  return (

    <div className="space-y-5">

      {/* Top Row */}

      <div className="flex items-center justify-between">

        {/* Avatar */}

        <div className="w-9 h-9 rounded-full bg-pink-400 flex items-center justify-center text-white font-semibold">
          JM
        </div>


        {/* Title */}

        <div className="flex items-center gap-2 text-lg font-semibold">
          {title}
          <ChevronDown size={18} />
        </div>


        {/* Add Button */}

        <button className="w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center text-white">
          <Plus size={18} />
        </button>

      </div>



      {/* Habit Filter Row */}

      <div className="flex items-center gap-4">

        {/* All */}

        <button
          onClick={() => onSelectHabit(null)}
          className={`px-4 py-1 rounded-full text-sm font-medium
            ${selectedHabit === null
              ? "bg-zinc-200 text-black"
              : "bg-zinc-800 text-zinc-400"}
          `}
        >
          All
        </button>


        {/* Habits */}

        {habits.map((habit) => (

          <button
            key={habit.id}
            onClick={() => onSelectHabit(habit.id)}
            className={`text-xl transition
              ${selectedHabit === habit.id
                ? "opacity-100"
                : "opacity-50"}
            `}
          >
            {habit.icon}
          </button>

        ))}

      </div>

    </div>

  )
}