// components/settings/archived/ArchivedHabitItem.tsx

type Props = {
  name: string
  subtitle: string
  badge: string
}

export default function ArchivedHabitItem({
  name,
  subtitle,
  badge,
}: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      
      <div className="flex items-center gap-3">
        
        {/* Emoji/Icon */}
        <div className="text-xl">🏋️</div>

        <div>
          <p className="text-white text-sm">{name}</p>
          <p className="text-zinc-400 text-xs">{subtitle}</p>
        </div>
      </div>

      {/* Badge */}
      <div className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-300">
        {badge}
      </div>
    </div>
  )
}