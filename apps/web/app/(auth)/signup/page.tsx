"use client"

import SignupForm from "@/components/auth/signup-form"
import Image from "next/image"

export default function SignupPage() {
  return (
    <div className="grid min-h-screen bg-black text-white lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="flex items-center justify-center px-8">
        <div className="w-full max-w-md">

          <SignupForm />

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative hidden lg:block">
        <Image
          src="/signup/sign-up.webp"
          alt="Signup cover"
          fill
          className="object-cover object-[25%_center]"
          priority
        />
      </div>

    </div>
  )
}