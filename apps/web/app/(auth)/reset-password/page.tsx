"use client"

import ResetPasswordForm from "@/components/auth/reset-password-form"

export default function ResetPasswordPage() {

  return (
    <div className="flex items-center justify-center min-h-screen px-8">
      <div className="w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </div>
  )
}