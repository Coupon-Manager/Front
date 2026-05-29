import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './store/auth'
import Login from './pages/Login'
import Register from './pages/Register'
import Main from './pages/Main'
import Supplier from './pages/Supplier'
import CouponViewer from './pages/CouponViewer'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Main /></ProtectedRoute>} />
        <Route path="/suppliers/:id" element={<ProtectedRoute><Supplier /></ProtectedRoute>} />
        <Route path="/suppliers/:id/coupons/:couponId" element={<ProtectedRoute><CouponViewer /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
