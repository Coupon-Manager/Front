import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSuppliers } from '../api/suppliers'
import { importFromEmail } from '../api/import'
import { getMe } from '../api/auth'
import { useAuth } from '../store/auth'
import { usePullToRefresh } from '../hooks/usePullToRefresh'
import Toast from '../components/Toast'
import SkeletonSupplierCard from '../components/SkeletonSupplierCard'
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
            {lastSync && (
              <p className="text-xs text-gray-400">· Synced {formatRelative(lastSync)}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleImport}
            disabled={importing}
            className="text-sm bg-yellow-400 text-gray-900 px-3 py-1.5 rounded-lg disabled:opacity-50"
          >
            {importing ? 'Importing...' : 'Import email'}
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
          <p className="text-center text-gray-400 mt-12">No suppliers yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {suppliers.map(supplier => (
              <button
                key={supplier.id}
                onClick={() => navigate(`/suppliers/${supplier.id}`, { state: { name: supplier.name } })}
                className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform"
              >
                {supplier.logo_url ? (
                  <img src={supplier.logo_url} alt={supplier.name} className="h-12 w-12 object-contain" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-400">
                    {supplier.name[0]}
                  </div>
                )}
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
