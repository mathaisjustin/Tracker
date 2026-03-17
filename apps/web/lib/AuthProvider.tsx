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

const SESSION_LIMIT = 60 * 60 * 1000 // 1 hour

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async () => {
    try {
      const profile = await getProfile()
      setProfile(profile)
    } catch (err) {
      console.error("Profile load failed", err)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (!user) return
    await loadProfile()
  }

  useEffect(() => {

    const initAuth = async () => {

      const { data } = await supabase.auth.getSession()
      const session = data.session

      if (!session) {
        setLoading(false)
        return
      }

      const loginTime = localStorage.getItem("login_time")

      if (loginTime) {
        const now = Date.now()

        if (now - Number(loginTime) > SESSION_LIMIT) {
          await supabase.auth.signOut()
          localStorage.removeItem("login_time")
          setLoading(false)
          return
        }
      }

      const user = session.user

      setSession(session)
      setUser(user)

      await loadProfile()

      setLoading(false)
    }

    initAuth()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {

        if (!session) {
          setUser(null)
          setSession(null)
          setProfile(null)
          return
        }

        localStorage.setItem("login_time", Date.now().toString())

        const user = session.user

        setSession(session)
        setUser(user)

        loadProfile()
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }

  }, [])

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)