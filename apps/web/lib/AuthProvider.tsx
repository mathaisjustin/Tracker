"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Session, User } from "@supabase/supabase-js"
import { getProfile } from "@/lib/api/profile"

type Profile = {
  id: string
  onboarding_completed: boolean
}

type AuthContextType = {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  /* -------------------------------- */
  /* LOAD PROFILE */
  /* -------------------------------- */
  const loadProfile = async () => {
    try {
      const profile = await getProfile()
      setProfile(profile)
    } catch (err) {
      console.error("Profile load failed", err)
      setProfile({ id: "", onboarding_completed: false })
    }
  }

  const refreshProfile = async () => {
    if (!user) return
    await loadProfile()
  }

  /* -------------------------------- */
  /* INIT AUTH (ONLY SOURCE OF TRUTH) */
  /* -------------------------------- */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        const session = data.session

        if (!session) {
          setUser(null)
          setSession(null)
          setProfile(null)
          return
        }

        setSession(session)
        setUser(session.user)

        // ✅ ONLY HERE we load profile
        await loadProfile()

      } catch (err) {
        console.error("Auth init error:", err)
      } finally {
        setLoading(false) // ✅ ALWAYS resolve
      }
    }

    initAuth()

    /* -------------------------------- */
    /* AUTH LISTENER (NO PROFILE LOAD) */
    /* -------------------------------- */
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth event:", _event)

        if (!session) {
          setUser(null)
          setSession(null)
          setProfile(null)
          setLoading(false)
          return
        }

        // ✅ Just update session/user
        setSession(session)
        setUser(session.user)

        // ❌ DO NOT LOAD PROFILE HERE
        // ❌ DO NOT TOUCH loading here
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, session, profile, loading, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)