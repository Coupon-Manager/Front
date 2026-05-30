import { useState, useCallback } from 'react'

const STORAGE_KEY = 'supplier_colors'

function load(): Record<number, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function useSupplierColors() {
  const [colors, setColors] = useState<Record<number, string>>(load)

  const setColor = useCallback((supplierId: number, color: string) => {
    setColors(prev => {
      const next = { ...prev, [supplierId]: color }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { colors, setColor }
}
