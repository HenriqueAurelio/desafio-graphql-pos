import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { LoginPage } from './pages/login/LoginPage'
import { RegisterPage } from './pages/register/RegisterPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { TransactionsPage } from './pages/transactions/TransactionsPage'
import { CategoriesPage } from './pages/categories/CategoriesPage'
import { ProfilePage } from './pages/profile/ProfilePage'
import { AppLayout } from './components/AppLayout'
import { useAuth } from './contexts/useAuth'

function AuthGateway() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (!user) {
    if (location.pathname !== '/') return <Navigate to="/" replace />
    return <LoginPage />
  }
  return <AppLayout />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/" replace />
  return <>{children}</>
}

function App() {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  useEffect(() => {
    const handler = () => { setUser(null); navigate('/') }
    window.addEventListener('auth-error', handler)
    return () => window.removeEventListener('auth-error', handler)
  }, [navigate, setUser])

  return (
    <Routes>
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/" element={<AuthGateway />}>
        <Route index element={<DashboardPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
