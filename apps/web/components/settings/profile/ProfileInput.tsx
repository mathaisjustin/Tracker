// components/settings/profile/ProfileInput.tsx

type Props = {
  label: string
  value: string
}

export default function ProfileInput({ label, value }: Props) {
  return (
    <div className="px-4 py-4">
      
      <p className="text-xs text-zinc-500 mb-2">{label}</p>

      <input
        defaultValue={value}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
      />
    </div>
  )
}