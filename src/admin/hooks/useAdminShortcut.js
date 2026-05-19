import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Secret keyboard shortcut: Ctrl + Shift + A
 * Opens the admin login page from anywhere in the app.
 */
export function useAdminShortcut() {
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        navigate('/admin/login')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate])
}
