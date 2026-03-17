"use client"

import { useState } from "react"

import SettingsSubHeader from "@/components/settings/SettingsSubHeader"
import SettingsSection from "@/components/settings/SettingsSection"
import SettingsCard from "@/components/settings/SettingsCard"
import { SettingsDivider } from "@/components/settings/SettingsDivider"

import TimezoneSearch from "@/components/settings/timezone/TimezoneSearch"
import TimezoneItem from "@/components/settings/timezone/TimezoneItem"

export default function TimezonePage() {
  const [selected, setSelected] = useState("auto")

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">

      <SettingsSubHeader title="Timezone" />

      <TimezoneSearch />

      {/* SUGGESTED */}
      <SettingsSection title="SUGGESTED">
        <SettingsCard>
          <TimezoneItem
            title="Auto-detect"
            subtitle="Use device timezone"
            selected={selected === "auto"}
            onClick={() => setSelected("auto")}
          />
        </SettingsCard>
      </SettingsSection>

      {/* ASIA */}
      <SettingsSection title="ASIA">
        <SettingsCard>

          <TimezoneItem
            title="IST — India Standard Time"
            subtitle="UTC +5:30"
            selected={selected === "IST"}
            onClick={() => setSelected("IST")}
          />
          <SettingsDivider />

          <TimezoneItem
            title="GST — Gulf Standard Time"
            subtitle="UTC +4:00"
            selected={selected === "GST"}
            onClick={() => setSelected("GST")}
          />
          <SettingsDivider />

          <TimezoneItem
            title="SGT — Singapore Time"
            subtitle="UTC +8:00"
            selected={selected === "SGT"}
            onClick={() => setSelected("SGT")}
          />

        </SettingsCard>
      </SettingsSection>

      {/* EUROPE */}
      <SettingsSection title="EUROPE">
        <SettingsCard>

          <TimezoneItem
            title="GMT — Greenwich Mean Time"
            subtitle="UTC +0:00"
            selected={selected === "GMT"}
            onClick={() => setSelected("GMT")}
          />
          <SettingsDivider />

          <TimezoneItem
            title="CET — Central European Time"
            subtitle="UTC +1:00"
            selected={selected === "CET"}
            onClick={() => setSelected("CET")}
          />

        </SettingsCard>
      </SettingsSection>

      {/* AMERICAS */}
      <SettingsSection title="AMERICAS">
        <SettingsCard>

          <TimezoneItem
            title="EST — Eastern Standard Time"
            subtitle="UTC -5:00"
            selected={selected === "EST"}
            onClick={() => setSelected("EST")}
          />
          <SettingsDivider />

          <TimezoneItem
            title="PST — Pacific Standard Time"
            subtitle="UTC -8:00"
            selected={selected === "PST"}
            onClick={() => setSelected("PST")}
          />

        </SettingsCard>
      </SettingsSection>

    </div>
  )
}