import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCoupons } from '../api/coupons'
import type { Coupon } from '../types'

type SortKey = 'value' | 'date'
type SortDir = 'asc' | 'desc'

function sortCoupons(coupons: Coupon[], key: SortKey, dir: SortDir): Coupon[] {
  return [...coupons].sort((a, b) => {
    const val = key === 'value'
      ? a.value - b.value
      : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    return dir === 'asc' ? val : -val
  })
}

function CouponRow({ coupon, supplierId }: { coupon: Coupon; supplierId: string }) {
  const navigate = useNavigate()
  const date = new Date(coupon.created_at).toLocaleDateString()
  return (
    <button
      onClick={() => navigate(`/suppliers/${supplierId}/coupons/${coupon.id}`)}
      className={`bg-white rounded-xl shadow px-4 py-3 flex items-center justify-between text-left active:scale-95 transition-transform ${
        coupon.used ? 'opacity-40' : ''
      }`}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm text-gray-500">{coupon.code ?? 'Code not parsed yet'}</span>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
      <span className="text-lg font-bold text-green-600">₪{coupon.value}</span>
    </button>
  )
}

export default function Supplier() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('value')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const toggleDir = () => setSortDir(d => d === 'desc' ? 'asc' : 'desc')

  useEffect(() => {
    if (!id) return
    getCoupons(Number(id))
      .then(setCoupons)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load coupons'))
      .finally(() => setLoading(false))
  }, [id])

  const unused = sortCoupons(coupons.filter(c => !c.used), sortKey, sortDir)
  const used = sortCoupons(coupons.filter(c => c.used), sortKey, sortDir)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="text-blue-600 font-medium">
          ← Back
        </button>
        <h1 className="text-lg font-bold flex-1">Coupons</h1>
        <div className="flex items-center gap-1">
          <select
            value={sortKey}
            onChange={e => setSortKey(e.target.value as SortKey)}
            className="text-sm text-gray-500 bg-transparent focus:outline-none"
          >
            <option value="value">Value</option>
            <option value="date">Date</option>
          </select>
          <button onClick={toggleDir} className="text-sm text-gray-500 w-5 text-center">
            {sortDir === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </header>

      <main className="px-4 py-4 flex flex-col gap-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-400 mt-12">Loading...</p>
        ) : coupons.length === 0 ? (
          <p className="text-center text-gray-400 mt-12">No coupons yet.</p>
        ) : (
          <>
            <section className="flex flex-col gap-2">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Available ({unused.length})
              </h2>
              {unused.length === 0 ? (
                <p className="text-sm text-gray-400">No available coupons.</p>
              ) : (
                unused.map(c => <CouponRow key={c.id} coupon={c} supplierId={id!} />)
              )}
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Used ({used.length})
              </h2>
              {used.length === 0 ? (
                <p className="text-sm text-gray-400">No used coupons.</p>
              ) : (
                used.map(c => <CouponRow key={c.id} coupon={c} supplierId={id!} />)
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
