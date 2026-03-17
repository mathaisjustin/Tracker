"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import SettingsSection from "@/components/settings/SettingsSection"
import SettingsCard from "@/components/settings/SettingsCard"
import { SettingsDivider } from "@/components/settings/SettingsDivider"

import SettingsItem from "@/components/settings/SettingsItem"
import SettingsProfile from "@/components/settings/SettingsProfile"
import SettingsToggle from "@/components/settings/SettingsToggle"

import { supabase } from "@/lib/supabaseClient"

import { Key, Bell, Globe, Archive, Flame, Shield, Clock, Palette, Database, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()

  const [notifications, setNotifications] = useState(true)
  const [graceDay, setGraceDay] = useState(true)
  const [partial, setPartial] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem("login_time")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">

      <h1 className="text-3xl font-semibold mb-6">Settings</h1>

      {/* ACCOUNT */}
      <SettingsSection title="ACCOUNT">
        <SettingsCard>

          <SettingsProfile />
          <SettingsDivider />

          <SettingsItem
            title="Change password"
            icon={<Key />}
            onClick={() => router.push("/dashboard/settings/password")}
          />
          <SettingsDivider />

          <SettingsItem
            title="Notifications"
            subtitle="Daily reminder · 8:00 PM"
            icon={<Bell />}
            right={
              <SettingsToggle
                enabled={notifications}
                onChange={setNotifications}
              />
            }
          />
          <SettingsDivider />

          <SettingsItem
            title="Timezone"
            subtitle="Auto-detected"
            icon={<Globe />}
            right={<span>IST +5:30</span>}
            onClick={() => router.push("/dashboard/settings/timezone")}
          />

        </SettingsCard>
      </SettingsSection>

      {/* HABITS */}
      <SettingsSection title="HABITS">
        <SettingsCard>

          <SettingsItem
            title="Archived habits"
            subtitle="View and restore"
            icon={<Archive />}
            right={<span>2</span>}
            onClick={() => router.push("/dashboard/settings/archived")}
          />
          <SettingsDivider />

          <SettingsItem
            title="Default unit"
            subtitle="For new habits"
            icon={<Database />}
            right={<span>count</span>}
            onClick={() => router.push("/dashboard/settings/unit")}
          />

        </SettingsCard>
      </SettingsSection>

      {/* STREAKS */}
      <SettingsSection title="STREAKS">
        <SettingsCard>

          <SettingsItem
            title="Partial counts as done"
            subtitle="Won't break your streak"
            icon={<Flame />}
            right={
              <SettingsToggle
                enabled={partial}
                onChange={setPartial}
              />
            }
          />
          <SettingsDivider />

          <SettingsItem
            title="Grace day"
            subtitle="Allow 1 miss per week"
            icon={<Shield />}
            right={
              <SettingsToggle
                enabled={graceDay}
                onChange={setGraceDay}
              />
            }
          />
          <SettingsDivider />

          <SettingsItem
            title="Day resets at"
            subtitle="When yesterday ends"
            icon={<Clock />}
            right={<span>Midnight</span>}
            onClick={() => router.push("/dashboard/settings/streaks-reset")}
          />

        </SettingsCard>
      </SettingsSection>

      {/* APPEARANCE */}
      <SettingsSection title="APPEARANCE">
        <SettingsCard>

          <SettingsItem
            title="Accent color"
            subtitle="App-wide highlight"
            icon={<Palette />}
            onClick={() => router.push("/dashboard/settings/appearance")}
          />
          <SettingsDivider />

          <SettingsItem
            title="Theme"
            subtitle="Light mode coming soon"
            icon={<Database />}
            right={<span>Dark</span>}
            onClick={() => router.push("/dashboard/settings/theme")}
          />

        </SettingsCard>
      </SettingsSection>

      {/* DATA */}
      <SettingsSection title="DATA">
        <SettingsCard>

          <SettingsItem
            title="Export data"
            subtitle="Download as CSV"
            icon={<Database />}
          />
          <SettingsDivider />

          <SettingsItem
            title="Reset all stats"
            subtitle="Cannot be undone"
            icon={<Trash2 />}
            right={<span className="text-red-500">›</span>}
          />

        </SettingsCard>
      </SettingsSection>

      {/* LOGOUT */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl border border-zinc-700"
        >
          Log out
        </button>
      </div>

    </div>
  )
}