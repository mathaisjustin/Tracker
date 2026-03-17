"use client"

import { useState } from "react"

import SettingsSubHeader from "@/components/settings/SettingsSubHeader"
import SettingsCard from "@/components/settings/SettingsCard"
import { SettingsDivider } from "@/components/settings/SettingsDivider"

import UnitItem from "@/components/settings/unit/UnitItem"

export default function UnitPage() {
  const [selected, setSelected] = useState("count")

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">

      <SettingsSubHeader title="Default unit" />

      <p className="text-zinc-400 text-sm mb-6">
        This is pre-filled when you create a new habit. You can always change it per habit.
      </p>

      <SettingsCard>

        <UnitItem
          title="count"
          subtitle="e.g. cigarettes, glasses, reps"
          selected={selected === "count"}
          onClick={() => setSelected("count")}
        />
        <SettingsDivider />

        <UnitItem
          title="minutes"
          subtitle="e.g. meditation, reading, exercise"
          selected={selected === "minutes"}
          onClick={() => setSelected("minutes")}
        />
        <SettingsDivider />

        <UnitItem
          title="hours"
          subtitle="e.g. sleep, screen time, study"
          selected={selected === "hours"}
          onClick={() => setSelected("hours")}
        />
        <SettingsDivider />

        <UnitItem
          title="km"
          subtitle="e.g. running, cycling, walking"
          selected={selected === "km"}
          onClick={() => setSelected("km")}
        />
        <SettingsDivider />

        <UnitItem
          title="ml / cups"
          subtitle="e.g. water, coffee intake"
          selected={selected === "ml"}
          onClick={() => setSelected("ml")}
        />
        <SettingsDivider />

        <UnitItem
          title="steps"
          subtitle="e.g. daily step count"
          selected={selected === "steps"}
          onClick={() => setSelected("steps")}
        />
        <SettingsDivider />

        <UnitItem
          title="calories"
          subtitle="e.g. food intake, burned"
          selected={selected === "calories"}
          onClick={() => setSelected("calories")}
        />

      </SettingsCard>

    </div>
  )
}