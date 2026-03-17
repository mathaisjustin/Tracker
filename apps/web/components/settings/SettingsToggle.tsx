"use client"

type Props = {
  enabled: boolean
  onChange: (val: boolean) => void
}

export default function SettingsToggle({ enabled, onChange }: Props) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onChange(!enabled)
      }}
      className={`w-12 h-7 rounded-full p-1 flex items-center ${
        enabled ? "bg-pink-500 justify-end" : "bg-zinc-700"
      }`}
    >
      <div className="w-5 h-5 bg-white rounded-full" />
    </div>
  )
}