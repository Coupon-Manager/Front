import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCoupons, markCouponUsed } from '../api/coupons'
import type { Coupon } from '../types'

export default function CouponViewer() {
  const { id, couponId } = useParams<{ id: string; couponId: string }>()
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [marking, setMarking] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!coupon?.code) return
    navigator.clipboard.writeText(coupon.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (!id || !couponId) return
    getCoupons(Number(id))
      .then(coupons => {
        const found = coupons.find(c => c.id === Number(couponId))
        if (!found) setError('Coupon not found')
        else setCoupon(found)
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load coupon'))
      .finally(() => setLoading(false))
  }, [id, couponId])

  const handleMarkUsed = async () => {
    if (!coupon) return
    setMarking(true)
    try {
      const updated = await markCouponUsed(coupon.id)
      setCoupon(updated)
      setConfirming(false)
      navigate(`/suppliers/${id}`, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as used')
    } finally {
      setMarking(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(`/suppliers/${id}`)} className="text-yellow-600 font-medium">
          ← Back
        </button>
        <h1 className="text-lg font-bold">Coupon</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 gap-8">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : coupon ? (
          <>
            <div className="bg-white rounded-2xl shadow w-full p-8 flex flex-col items-center gap-4">
              {coupon.code ? (
                <>
                  <span className="text-4xl font-mono font-bold tracking-widest text-center break-all">
                    {coupon.code.replace(/(.{4})/g, '$1 ').trim()}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-sm text-yellow-600 font-medium"
                  >
                    {copied ? 'Copied!' : 'Copy code'}
                  </button>
                </>
              ) : (
                <span className="text-gray-400 text-lg">Code not parsed yet</span>
              )}
            </div>

            <div className="text-center">
              <span className="text-3xl font-bold text-red-600">₪{coupon.value}</span>
            </div>

            <button
              onClick={() => setConfirming(true)}
              className={`w-full rounded-xl py-3 font-medium text-lg text-white ${
                coupon.used ? 'bg-gray-400' : 'bg-red-500'
              }`}
            >
              {coupon.used ? 'Mark as unused' : 'Mark as used'}
            </button>
          </>
        ) : null}
      </main>

      {confirming && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-center">
              {coupon?.used ? 'Mark as unused?' : 'Mark as used?'}
            </h2>
            {!coupon?.used && (
              <p className="text-sm text-gray-500 text-center">You can undo this later.</p>
            )}
            <button
              onClick={handleMarkUsed}
              disabled={marking}
              className="bg-red-500 text-white rounded-xl py-3 font-medium disabled:opacity-50"
            >
              {marking ? 'Marking...' : 'Confirm'}
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-gray-500 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
