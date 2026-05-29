import type { Supplier } from '../types'
import { request } from './client'

export function getSuppliers() {
  return request<Supplier[]>('/suppliers')
}
