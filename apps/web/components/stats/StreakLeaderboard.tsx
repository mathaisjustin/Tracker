"use client"

type StreakItem = {
  rank: number
  name: string
  value: number
  label: string
  status: "active" | "risk" | "miss"
}

interface StreakLeaderboardProps {
  items: StreakItem[]
}

export default function StreakLeaderboard({ items }: StreakLeaderboardProps) {

  return (

    <div className="mt-8">

      <div className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 rounded-3xl p-6">

        {/* Title */}

        <p className="text-xs tracking-[0.35em] text-zinc-500 mb-6">
          STREAK LEADERBOARD
        </p>


        <div className="space-y-6">

          {items.map((item, i) => {

            const badge =
              item.status === "active"
                ? "bg-green-900/40 text-green-400 border border-green-700"
                : item.status === "risk"
                ? "bg-yellow-900/40 text-yellow-400 border border-yellow-700"
                : "bg-red-900/40 text-red-400 border border-red-700"

            const badgeText =
              item.status === "active"
                ? "🔥 Active"
                : item.status === "risk"
                ? "⚡ At risk"
                : "❄ 2 day miss"

            return (

              <div key={item.rank}>

                <div className="flex items-center justify-between">

                  {/* Left */}

                  <div className="flex items-center gap-4">

                    <span className="text-zinc-500 w-6">
                      #{item.rank}
                    </span>

                    <div>

                      <p className="text-lg font-semibold">
                        {item.name}
                      </p>

                      <span className={`text-xs px-3 py-1 rounded-full ${badge}`}>
                        {badgeText}
                      </span>

                    </div>

                  </div>


                  {/* Right */}

                  <div className="text-right">

                    <p className="text-2xl font-semibold">
                      {item.value}
                    </p>

                    <p className="text-xs text-zinc-500">
                      {item.label}
                    </p>

                  </div>

                </div>


                {/* Divider */}

                {i !== items.length - 1 && (
                  <div className="border-t border-zinc-800 mt-6" />
                )}

              </div>

            )

          })}

        </div>

      </div>

    </div>

  )

}