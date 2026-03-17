"use client"

import { useState } from "react"

import SettingsSubHeader from "@/components/settings/SettingsSubHeader"
import SettingsCard from "@/components/settings/SettingsCard"
import { SettingsDivider } from "@/components/settings/SettingsDivider"

import ThemeItem from "@/components/settings/theme/ThemeItem"

export default function ThemePage() {
  const [selected, setSelected] = useState("dark")

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">

      <SettingsSubHeader title="Theme" />

      <p className="text-zinc-400 text-sm mb-6">
        Light mode is coming soon. For now only dark mode is available.
      </p>

      <SettingsCard>

        {/* DARK */}
        <div onClick={() => setSelected("dark")}>
          <ThemeItem
            title="Dark"
            subtitle="Pure black background"
            selected={selected === "dark"}
          />
        </div>

        <SettingsDivider />

        {/* LIGHT */}
        <ThemeItem
          title="Light"
          subtitle="Coming soon"
          disabled
        />

      </SettingsCard>

    </div>
  )
}