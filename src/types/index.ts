export interface Supplier {
  id: number
  name: string
  available_balance: number
}

export interface Coupon {
  id: number
  supplier_id: number
  code: string
  value: number
  is_used: boolean
}

export interface User {
  email: string
}
