import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../store/useAdminStore'

/**
 * Use inside any admin page.
 * Redirects to /admin/login if not authenticated.
 */
export function useAdminAuth() {
  const isAuthenticated = useAdminStore(s => s.isAuthenticated)
  const navigate        = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true })
    }
  }, [isAuthenticated, navigate])

  return isAuthenticated
}
