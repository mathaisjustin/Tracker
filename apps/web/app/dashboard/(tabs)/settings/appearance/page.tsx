"use client"

import { useState } from "react"

import SettingsSubHeader from "@/components/settings/SettingsSubHeader"
import SettingsSection from "@/components/settings/SettingsSection"
import SettingsCard from "@/components/settings/SettingsCard"

import ColorItem from "@/components/settings/appearance/ColorItem"
import ColorPreview from "@/components/settings/appearance/ColorPreview"

const COLORS = [
  "#ec4899", // pink
  "#4ade80", // green
  "#60a5fa", // blue
  "#facc15", // yellow
  "#a78bfa", // purple
  "#f87171", // red
  "#34d399", // teal
  "#fb923c", // orange
  "#d1d5db", // gray
  "#f472b6", // pink alt
]

export default function AccentColorPage() {
  const [selected, setSelected] = useState(COLORS[0])

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">

      <SettingsSubHeader title="Accent color" />

      {/* INFO */}
      <p className="text-zinc-400 text-sm mb-6">
        Your accent color appears on the avatar, add button, active states, and toggles throughout the app.
      </p>

      {/* COLOR GRID */}
      <SettingsSection title="CHOOSE A COLOR">
        <SettingsCard>

          <div className="grid grid-cols-5 gap-4 p-4">
            {COLORS.map((color) => (
              <ColorItem
                key={color}
                color={color}
                selected={selected === color}
                onClick={() => setSelected(color)}
              />
            ))}
          </div>

        </SettingsCard>
      </SettingsSection>

      {/* PREVIEW */}
      <SettingsSection title="PREVIEW">
        <SettingsCard>
          <ColorPreview color={selected} />
        </SettingsCard>
      </SettingsSection>

      {/* BUTTON */}
      <div className="mt-6">
        <button className="w-full py-3 rounded-xl border border-zinc-700">
          Apply color
        </button>
      </div>

    </div>
  )
}