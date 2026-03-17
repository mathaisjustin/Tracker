"use client"

import { useState } from "react"

import SettingsSubHeader from "@/components/settings/SettingsSubHeader"
import SettingsCard from "@/components/settings/SettingsCard"
import { SettingsDivider } from "@/components/settings/SettingsDivider"

import ResetTimeItem from "@/components/settings/streaks/ResetTimeItem"

export default function ResetTimePage() {
  const [selected, setSelected] = useState("midnight")

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">

      <SettingsSubHeader title="Day resets at" />

      <p className="text-zinc-400 text-sm mb-6">
        This controls when "today" switches to "yesterday". Choose based on your sleep schedule.
      </p>

      <SettingsCard>

        <ResetTimeItem
          title="Midnight — 12:00 AM"
          subtitle="Standard calendar day"
          selected={selected === "midnight"}
          onClick={() => setSelected("midnight")}
        />
        <SettingsDivider />

        <ResetTimeItem
          title="2:00 AM"
          subtitle="Good for night owls"
          selected={selected === "2am"}
          onClick={() => setSelected("2am")}
        />
        <SettingsDivider />

        <ResetTimeItem
          title="4:00 AM"
          subtitle="Late sleepers / shift workers"
          selected={selected === "4am"}
          onClick={() => setSelected("4am")}
        />
        <SettingsDivider />

        <ResetTimeItem
          title="6:00 AM"
          subtitle="Early morning reset"
          selected={selected === "6am"}
          onClick={() => setSelected("6am")}
        />

      </SettingsCard>

    </div>
  )
}