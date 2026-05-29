import type { Coupon } from '../types'
import { request } from './client'

export function importFromEmail() {
  return request<{ imported: number; skipped: number; coupons: Coupon[] }>('/import/email', {
    method: 'POST',
  })
}
