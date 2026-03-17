"use client"

import SettingsSubHeader from "@/components/settings/SettingsSubHeader"
import SettingsCard from "@/components/settings/SettingsCard"
import { SettingsDivider } from "@/components/settings/SettingsDivider"

import ArchivedHabitItem from "@/components/settings/archived/ArchivedHabitItem"

export default function ArchivedPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">

      {/* HEADER */}
      <SettingsSubHeader title="Archived habits" />

      {/* INFO */}
      <p className="text-zinc-400 text-sm mb-6">
        Archived habits are read-only. Their history and stats are preserved but they can no longer be logged or restored.
      </p>

      {/* LIST */}
      <SettingsCard>

        <ArchivedHabitItem
          name="Cigarettes"
          subtitle="Archived on Feb 3, 2025 · 47 day history"
          badge="Bad"
        />

        <SettingsDivider />

        <ArchivedHabitItem
          name="Gym"
          subtitle="Archived on Jan 12, 2025 · 23 day history"
          badge="Good"
        />

      </SettingsCard>

      {/* FOOTER */}
      <p className="text-center text-zinc-500 text-sm mt-8">
        Archived habits cannot be restored.{"\n"}
        Their stats still count in your global reports.
      </p>

    </div>
  )
}