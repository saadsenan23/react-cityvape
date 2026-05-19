import { Navigate } from 'react-router-dom'
import { useAdminStore } from '../../store/useAdminStore'

export default function AdminRoute({ children }) {
  const isAuthenticated = useAdminStore(s => s.isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}
