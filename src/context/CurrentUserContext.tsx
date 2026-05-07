'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface CurrentUser {
  id: string
  keycloakUserId: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  department: string
  location: string
  role: string
  status: string
  avatarUrl: string | null
}

interface ContextValue {
  user: CurrentUser | null
  setUser: (u: CurrentUser | null) => void
  refresh: () => void
  initials: string
  fullName: string
  avatarSrc: string | null
}

const CurrentUserContext = createContext<ContextValue | null>(null)

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null)

  const refresh = useCallback(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return
    fetch('/api/v1users/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.data) setUser(data.data) })
      .catch(() => { })
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '??'
  const fullName = user ? `${user.firstName} ${user.lastName}` : '—'
  const avatarSrc = user?.keycloakUserId
    ? `/api/v1/users/${user.keycloakUserId}/avatar`
    : null

  return (
    <CurrentUserContext.Provider value={{ user, setUser, refresh, initials, fullName, avatarSrc }}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export function useCurrentUser() {
  const ctx = useContext(CurrentUserContext)
  if (!ctx) throw new Error('useCurrentUser must be inside CurrentUserProvider')
  return ctx
}
