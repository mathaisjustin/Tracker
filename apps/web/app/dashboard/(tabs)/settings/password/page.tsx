"use client"

import SettingsSubHeader from "@/components/settings/SettingsSubHeader"
import SettingsSection from "@/components/settings/SettingsSection"
import SettingsCard from "@/components/settings/SettingsCard"
import { SettingsDivider } from "@/components/settings/SettingsDivider"

import PasswordInput from "@/components/settings/password/PasswordInput"

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">

      {/* HEADER */}
      <SettingsSubHeader title="Change password" />

      {/* INFO */}
      <p className="text-zinc-400 text-sm mb-6">
        Your new password must be at least 8 characters and different from your current one.
      </p>

      {/* CURRENT */}
      <SettingsSection title="CURRENT">
        <SettingsCard>
          <PasswordInput
            label="CURRENT PASSWORD"
            placeholder="Enter current password"
          />
        </SettingsCard>
      </SettingsSection>

      {/* NEW */}
      <SettingsSection title="NEW">
        <SettingsCard>

          <PasswordInput
            label="NEW PASSWORD"
            placeholder="At least 8 characters"
          />

          <SettingsDivider />

          <PasswordInput
            label="CONFIRM NEW PASSWORD"
            placeholder="Repeat new password"
          />

        </SettingsCard>
      </SettingsSection>

      {/* BUTTON */}
      <div className="mt-6">
        <button className="w-full py-3 rounded-xl border border-zinc-700 font-medium">
          Update password
        </button>
      </div>

      {/* RESET LINK */}
      <p className="text-center text-zinc-500 text-sm mt-4">
        Forgot password?{" "}
        <span className="text-white">Send reset link</span>
      </p>

    </div>
  )
}