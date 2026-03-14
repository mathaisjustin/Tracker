"use client"

import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem("login_time")
    router.push("/login")
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-zinc-400 mt-4">User settings will go here</p>
      <Button
        variant="destructive"
        className="mt-6"
        onClick={handleLogout}
      >
        Log out
      </Button>
    </div>
  )
}
