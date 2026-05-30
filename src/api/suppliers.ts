import type { Supplier } from '../types'
import { request } from './client'

export function getSuppliers() {
  return request<Supplier[]>('/suppliers')
}

export function updateSupplierColor(id: number, color: string) {
  return request<Supplier>(`/suppliers/${id}/preference`, {
    method: 'PATCH',
    body: JSON.stringify({ color }),
  })
}
