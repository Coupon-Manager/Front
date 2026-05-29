import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSuppliers } from '../api/suppliers'
import { importFromEmail } from '../api/import'
import { useAuth } from '../store/auth'
import type { Supplier } from '../types'

export default function Main() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number } | null>(null)

  useEffect(() => {
    getSuppliers()
      .then(setSuppliers)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load suppliers'))
      .finally(() => setLoading(false))
  }, [])

  const handleImport = async () => {
    setImporting(true)
    setImportResult(null)
    try {
      const result = await importFromEmail()
      setImportResult({ imported: result.imported, skipped: result.skipped })
      const updated = await getSuppliers()
      setSuppliers(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Coupon Manager</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleImport}
            disabled={importing}
            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
          >
            {importing ? 'Importing...' : 'Import email'}
          </button>
          <button onClick={logout} className="text-sm text-gray-500">
            Logout
          </button>
        </div>
      </header>

      <main className="px-4 py-4">
        {importResult && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-700">
            Imported {importResult.imported}, skipped {importResult.skipped}
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-400 mt-12">Loading...</p>
        ) : suppliers.length === 0 ? (
          <p className="text-center text-gray-400 mt-12">No suppliers yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {suppliers.map(supplier => (
              <button
                key={supplier.id}
                onClick={() => navigate(`/suppliers/${supplier.id}`)}
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
                <span className="text-lg font-bold text-green-600">₪{supplier.available_balance}</span>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
