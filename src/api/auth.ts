import type { User } from '../types'
import { request } from './client'

export function login(email: string, password: string) {
  return request<{ access_token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function register(email: string, password: string) {
  return request<{ access_token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function getMe() {
  return request<User>('/auth/me')
}
