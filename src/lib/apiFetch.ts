const REFRESH_URL = '/backend/auth/refresh'

let refreshPromise: Promise<string | null> | null = null

async function doRefresh(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) return null

  try {
    const res = await fetch(REFRESH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const token = data?.data?.token
    if (!token?.access_token) return null
    localStorage.setItem('access_token', token.access_token)
    if (token.refresh_token) localStorage.setItem('refresh_token', token.refresh_token)
    return token.access_token
  } catch {
    return null
  }
}

function redirectToLogin() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  window.location.replace('/login')
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('access_token')
  const headers = new Headers(options.headers as HeadersInit)
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(url, { ...options, headers })
  if (res.status !== 401) return res

  // Coalesce concurrent 401s into one refresh call
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => { refreshPromise = null })
  }
  const newToken = await refreshPromise

  if (!newToken) {
    redirectToLogin()
    return res
  }

  const retryHeaders = new Headers(options.headers as HeadersInit)
  retryHeaders.set('Authorization', `Bearer ${newToken}`)
  return fetch(url, { ...options, headers: retryHeaders })
}
