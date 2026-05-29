export interface Supplier {
  id: number
  name: string
  logo_url: string | null
  available_balance: number
}

export interface Coupon {
  id: number
  supplier_id: number
  code: string | null
  value: number
  used: boolean
  used_at: string | null
  added_by_id: number
}

export interface User {
  email: string
}
