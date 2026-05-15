'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { apiFetch } from '@/lib/apiFetch'

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
  const [user, setUserState] = useState<CurrentUser | null>(null)
  const [avatarTs, setAvatarTs] = useState(() => Date.now())

  const setUser = useCallback((u: CurrentUser | null) => {
    setUserState(u)
    if (u) setAvatarTs(Date.now())
  }, [])

  const refresh = useCallback(() => {
    if (!localStorage.getItem('access_token')) return
    apiFetch('/api/v1/users/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.data) setUser(data.data) })
      .catch(() => { })
  }, [setUser])

  useEffect(() => { refresh() }, [refresh])

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '??'
  const fullName = user ? `${user.firstName} ${user.lastName}` : '—'
  const avatarSrc = user?.keycloakUserId
    ? `/api/v1/users/${user.keycloakUserId}/avatar?v=${avatarTs}`
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
