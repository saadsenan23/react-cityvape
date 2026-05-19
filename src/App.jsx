import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppStore }           from './store/useAppStore'
import { useFirebaseProducts }   from './store/useFirebaseProducts'

// Public pages
import Layout         from './components/Layout'
import HomePage       from './pages/HomePage'
import ProductsPage   from './pages/ProductsPage'
import ContactPage    from './pages/ContactPage'
import PodSystemPage  from './pages/PodSystemPage'
import AgeGate        from './components/AgeGate'

// Admin pages
import AdminLayout       from './admin/components/AdminLayout'
import AdminRoute        from './admin/components/AdminRoute'
import AdminLoginPage    from './admin/pages/AdminLoginPage'
import AdminDashboard    from './admin/pages/AdminDashboard'
import AdminAddProduct   from './admin/pages/AdminAddProduct'
import AdminProductsPage from './admin/pages/AdminProductsPage'

/* ── One-time initializer ───────────────────────────────────────── */
function Init() {
  const { initTheme, language, setLanguage } = useAppStore()
  const { subscribe, unsubscribe }           = useFirebaseProducts()

  useEffect(() => {
    initTheme()
    setLanguage(language)
    subscribe()          // start real-time Firestore listener
    return unsubscribe   // cleanup on unmount
  }, []) // eslint-disable-line

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <Init />

      <Routes>
        {/* ── Public routes ── */}
        <Route path="/" element={<><AgeGate /><Layout /></>}>
          <Route index               element={<HomePage />} />
          <Route path="products"     element={<ProductsPage />} />
          <Route path="pod-system"   element={<PodSystemPage />} />
          <Route path="contact"      element={<ContactPage />} />
        </Route>

        {/* ── Admin routes ── */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index              element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard"   element={<AdminDashboard />} />
          <Route path="products"    element={<AdminProductsPage />} />
          <Route path="add"         element={<AdminAddProduct />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
