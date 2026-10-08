import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from 'react'
import { api, getStoredAuth, setStoredAuth, type AuthUser } from './client'

type AuthContextValue = {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  register: (fullName: string, email: string, password: string, phoneNumber?: string) => Promise<void>
  googleSignIn: (fullName: string, email: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuth())

  useEffect(() => {
    setStoredAuth(user)
  }, [user])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      async login(email, password) {
        const auth = await api<AuthUser>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          auth: false,
        })
        setUser(auth)
      },
  async register(fullName, email, password, phoneNumber?: string) {
        const auth = await api<AuthUser>('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ fullName, email, password, phoneNumber: phoneNumber || null }),
          auth: false,
        })
        setUser(auth)
      },
      async googleSignIn(fullName, email) {
        const auth = await api<AuthUser>('/auth/google', {
          method: 'POST',
          body: JSON.stringify({ fullName, email, googleId: `demo-google-${email}` }),
          auth: false,
        })
        setUser(auth)
      },
      logout() {
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
