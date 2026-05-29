import type { Coupon } from '../types'
import { request } from './client'

export function getCoupons(supplierId: number) {
  return request<Coupon[]>(`/suppliers/${supplierId}/coupons`)
}

export function addCoupon(data: { supplier_id: number; code: string; value: number }) {
  return request<Coupon>('/coupons', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function markCouponUsed(couponId: number) {
  return request<Coupon>(`/coupons/${couponId}/use`, {
    method: 'PATCH',
  })
}
