import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCoupons } from '../api/coupons'
import type { Coupon } from '../types'

type SortOrder = 'asc' | 'desc'

export default function Supplier() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  useEffect(() => {
    if (!id) return
    getCoupons(Number(id))
      .then(setCoupons)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load coupons'))
      .finally(() => setLoading(false))
  }, [id])

  const sorted = [...coupons].sort((a, b) =>
    sortOrder === 'desc' ? b.value - a.value : a.value - b.value
  )

  const toggleSort = () => setSortOrder(o => (o === 'desc' ? 'asc' : 'desc'))

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="text-blue-600 font-medium">
          ← Back
        </button>
        <h1 className="text-lg font-bold flex-1">Coupons</h1>
        <button onClick={toggleSort} className="text-sm text-gray-500">
          Value {sortOrder === 'desc' ? '↓' : '↑'}
        </button>
      </header>

      <main className="px-4 py-4">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-400 mt-12">Loading...</p>
        ) : sorted.length === 0 ? (
          <p className="text-center text-gray-400 mt-12">No coupons yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {sorted.map(coupon => (
              <button
                key={coupon.id}
                onClick={() => navigate(`/suppliers/${id}/coupons/${coupon.id}`)}
                className={`bg-white rounded-xl shadow px-4 py-3 flex items-center justify-between text-left transition-opacity active:scale-95 ${
                  coupon.used ? 'opacity-40' : ''
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-gray-500">
                    {coupon.code ?? 'Code not parsed yet'}
                  </span>
                  {coupon.used && (
                    <span className="text-xs text-gray-400">Used</span>
                  )}
                </div>
                <span className="text-lg font-bold text-green-600">₪{coupon.value}</span>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
