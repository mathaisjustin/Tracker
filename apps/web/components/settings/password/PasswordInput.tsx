// components/settings/password/PasswordInput.tsx

type Props = {
  label: string
  placeholder: string
}

export default function PasswordInput({ label, placeholder }: Props) {
  return (
    <div className="px-4 py-4">
      <p className="text-xs text-zinc-500 mb-2">{label}</p>

      <input
        type="password"
        placeholder={placeholder}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500"
      />
    </div>
  )
}