"use client"

import SettingsSubHeader from "@/components/settings/SettingsSubHeader"
import SettingsSection from "@/components/settings/SettingsSection"
import SettingsCard from "@/components/settings/SettingsCard"
import { SettingsDivider } from "@/components/settings/SettingsDivider"

import ProfileAvatar from "@/components/settings/profile/ProfileAvatar"
import ProfileInput from "@/components/settings/profile/ProfileInput"
import ProfileAccountRow from "@/components/settings/profile/ProfileAccountRow"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">

      {/* HEADER */}
      <SettingsSubHeader
        title="Profile"
        right={
          <button className="border border-zinc-600 px-4 py-1.5 rounded-lg text-sm">
            Save
          </button>
        }
      />

      {/* AVATAR */}
      <ProfileAvatar />

      {/* PERSONAL INFO */}
      <SettingsSection title="PERSONAL INFO">
        <SettingsCard>

          <ProfileInput
            label="FULL NAME"
            value="Justin Mathias"
          />

          <SettingsDivider />

          <ProfileInput
            label="EMAIL"
            value="justinm@gmail.com"
          />

        </SettingsCard>
      </SettingsSection>

      {/* CONNECTED */}
      <SettingsSection title="CONNECTED ACCOUNTS">
        <SettingsCard>

          <ProfileAccountRow
            title="Google"
            subtitle="Connected · justinm@gmail.com"
            action="Disconnect"
          />

          <SettingsDivider />

          <ProfileAccountRow
            title="GitHub"
            subtitle="Not connected"
            action="Connect"
          />

        </SettingsCard>
      </SettingsSection>

      {/* DANGER */}
      <SettingsSection title="DANGER ZONE">
        <SettingsCard>

          <div className="px-4 py-4 text-red-500">
            <p>Delete account</p>
            <p className="text-xs text-zinc-400">
              Permanently remove your data
            </p>
          </div>

        </SettingsCard>
      </SettingsSection>

    </div>
  )
}