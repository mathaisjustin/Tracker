type Props = {
  title: string
  subtitle: string
  action: string
}

export default function ProfileAccountRow({
  title,
  subtitle,
  action,
}: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      
      <div>
        <p className="text-white text-sm">{title}</p>
        <p className="text-zinc-400 text-xs">{subtitle}</p>
      </div>

      <button className="border border-zinc-600 px-3 py-1 rounded-lg text-sm">
        {action}
      </button>
    </div>
  )
}