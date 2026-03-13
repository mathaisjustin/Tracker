"use client"

import ForgotPasswordForm from "../../../components/auth/forgot-password-form"
import Image from "next/image"

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-screen bg-black text-white lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="flex items-center justify-center px-8">
        <div className="w-full max-w-md">

          <ForgotPasswordForm />

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative hidden lg:block">
        <Image
          src="/forgot-pass/reset-pass.webp"
          alt="Reset cover"
          fill
          className="object-cover scale-110"
          priority
        />
      </div>

    </div>
  )
}