"use client"

export default function SettingsSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-8">
      
      {/* Section Title */}
      <p className="text-xs text-zinc-500 tracking-[0.2em] mb-3">
        {title}
      </p>

      {children}
    </div>
  )
}