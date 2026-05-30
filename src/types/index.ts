export interface Supplier {
  id: number
  name: string
  color: string | null
  available_balance: number
}

export interface Coupon {
  id: number
  supplier_id: number
  code: string | null
  value: number
  used: boolean
  created_at: string
  used_at: string | null
  added_by_id: number
}

export interface User {
  email: string
  last_email_sync: string | null
}
