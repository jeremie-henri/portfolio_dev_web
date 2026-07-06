import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isConfigured } from './supabase'

const AuthContext = createContext(null)

// Ton email admin — doit correspondre à is_admin() dans schema.sql
const ADMIN_EMAIL = 'jeremiehenri99@gmail.com'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  // Si Supabase n'est pas configuré, rien à charger → loading démarre à false
  const [loading, setLoading] = useState(isConfigured)

  useEffect(() => {
    if (!isConfigured) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  const value = {
    session,
    loading,
    user: session?.user ?? null,
    isAdmin: session?.user?.email === ADMIN_EMAIL,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
    resetPassword: (email) =>
      supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/espace`,
      }),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
