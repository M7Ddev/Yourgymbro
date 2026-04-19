import { createContext, useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import { signIn, signOut } from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => setUser(session?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function login(email, password) {
    const data = await signIn(email, password)
    setUser(data.user)
  }

  async function logout() {
    await signOut()
    setUser(null)
  }

  const displayName = user?.user_metadata?.display_name ?? user?.email ?? null

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, displayName, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
