import { Navigate } from 'react-router-dom'
import { useAdminStore } from '../../store/useAdminStore'

export default function AdminRoute({ children }) {
  const isAuthenticated = useAdminStore(s => s.isAuthenticated)
  const isLoading = useAdminStore(s => s.isLoading)

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  return children
}
