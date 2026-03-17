"use client"

export default function SettingsCard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
      {children}
    </div>
  )
}