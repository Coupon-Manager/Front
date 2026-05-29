import { useState, createContext, useContext } from 'react'

const TOKEN_KEY = 'token'

function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

function removeStoredToken() {
  localStorage.removeItem(TOKEN_KEY)
}

interface AuthContextValue {
  token: string | null
  isAuthenticated: boolean
  saveToken: (token: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuthState(): AuthContextValue {
  const [token, setToken] = useState<string | null>(getStoredToken)

  const saveToken = (newToken: string) => {
    setStoredToken(newToken)
    setToken(newToken)
  }

  const logout = () => {
    removeStoredToken()
    setToken(null)
  }

  return { token, isAuthenticated: token !== null, saveToken, logout }
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
