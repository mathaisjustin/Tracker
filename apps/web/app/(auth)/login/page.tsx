"use client"

import LoginForm from "@/components/auth/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="grid min-h-screen bg-black text-white lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="flex items-center justify-center px-8">
        <div className="w-full max-w-md">

          <LoginForm />

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative hidden lg:block">
        <Image
          src="/login/Login.jpg"
          alt="Login cover"
          fill
          className="object-cover object-[20%_center]"
          priority
        />
      </div>

    </div>
  )
}