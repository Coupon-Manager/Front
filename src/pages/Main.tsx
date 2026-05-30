import { useEffect, useState, useCallback, useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSuppliers } from '../api/suppliers'
import { importFromEmail } from '../api/import'
import { getMe } from '../api/auth'
import { useAuth } from '../store/auth'
import { usePullToRefresh } from '../hooks/usePullToRefresh'
import Toast from '../components/Toast'
import SkeletonSupplierCard from '../components/SkeletonSupplierCard'
import EmptyState from '../components/EmptyState'
import type { Supplier } from '../types'

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return new Date(dateStr).toLocaleDateString()
}

export default function Main() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [, tick] = useReducer(n => n + 1, 0)

  useEffect(() => {
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [])

  const loadSuppliers = useCallback(async () => {
    try {
      const data = await getSuppliers()
      setSuppliers(data)
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Failed to load suppliers', type: 'error' })
    }
  }, [])

  useEffect(() => {
    loadSuppliers().finally(() => setLoading(false))
    getMe().then(user => setLastSync(user.last_email_sync)).catch(() => {})
  }, [loadSuppliers])

  const { refreshing, pulling } = usePullToRefresh(loadSuppliers)

  const handleImport = async () => {
    setImporting(true)
    try {
      const result = await importFromEmail()
      setToast({ message: `Imported ${result.imported}, skipped ${result.skipped}`, type: 'success' })
      await loadSuppliers()
      getMe().then(user => setLastSync(user.last_email_sync)).catch(() => {})
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Import failed', type: 'error' })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Coupon Manager</h1>
          <div className="flex items-center gap-2">
            {suppliers.length > 0 && (
              <span className="text-sm font-bold text-red-600">
                ₪{suppliers.reduce((sum, s) => sum + s.available_balance, 0)}
              </span>
            )}
            <p className="text-xs text-gray-400">
              {lastSync ? `· Synced ${formatRelative(lastSync)}` : '· Never synced'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleImport}
            disabled={importing}
            className="text-sm bg-yellow-400 text-gray-900 px-3 py-1.5 rounded-lg disabled:opacity-50 flex items-center gap-1.5"
          >
            {importing ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                Importing...
              </>
            ) : 'Import email'}
          </button>
          <button onClick={() => setConfirmLogout(true)} className="text-sm text-gray-500">
            Logout
          </button>
        </div>
      </header>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}

      <main className="px-4 py-4">
        {(pulling || refreshing) && (
          <p className="text-center text-sm text-gray-400 mb-2">
            {refreshing ? 'Refreshing...' : 'Release to refresh'}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonSupplierCard key={i} />)}
          </div>
        ) : suppliers.length === 0 ? (
          <EmptyState
            icon={
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <rect x="8" y="20" width="64" height="44" rx="6" stroke="currentColor" strokeWidth="4"/>
                <path d="M8 30l32 20 32-20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            title="No suppliers yet"
            subtitle="Tap Import email to add your first coupons"
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {suppliers.map(supplier => (
              <button
                key={supplier.id}
                onClick={() => navigate(`/suppliers/${supplier.id}`, { state: { name: supplier.name } })}
                className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform"
              >
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-400">
                  {supplier.name[0]}
                </div>
                <span className="text-sm font-medium text-gray-800 text-center">{supplier.name}</span>
                <span className="text-lg font-bold text-red-600">₪{supplier.available_balance}</span>
              </button>
            ))}
          </div>
        )}
      </main>

      {confirmLogout && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-center">Log out?</h2>
            <button
              onClick={logout}
              className="bg-red-500 text-white rounded-xl py-3 font-medium"
            >
              Log out
            </button>
            <button
              onClick={() => setConfirmLogout(false)}
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
