const BASE_URL = import.meta.env.VITE_API_BASE_URL

function getToken(): string | null {
  return localStorage.getItem('token')
}

function forceLogout() {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    if (res.status === 401 && !path.startsWith('/auth/')) forceLogout()
    const body = await res.json().catch(() => null)
    const detail = body?.detail ?? `${res.status} ${res.statusText}`
    throw new Error(detail)
  }

  return res.json()
}
