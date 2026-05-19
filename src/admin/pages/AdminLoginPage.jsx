import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdminStore } from '../../store/useAdminStore'

const EyeIcon = ({ open }) => open ? (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

export default function AdminLoginPage() {
  const [username, setUsername]     = useState('')
  const [password, setPassword]     = useState('')
  const [showPass, setShowPass]     = useState(false)
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const { login, isAuthenticated }  = useAdminStore()
  const navigate                    = useNavigate()

  // Already logged in
  if (isAuthenticated) {
    navigate('/admin/dashboard', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    // Simulate async auth delay for realism
    await new Promise(r => setTimeout(r, 600))

    const result = login(username.trim(), password)
    setLoading(false)

    if (result.ok) {
      navigate('/admin/dashboard', { replace: true })
    } else {
      setError(result.error)
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4"
      style={{
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.12) 0%, transparent 60%)',
      }}
    >
      {/* Decorative rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[600px] h-[600px] rounded-full border border-orange-500/8" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[400px] h-[400px] rounded-full border border-orange-500/12" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm"
      >
        {/* Card */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/60">

          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

          <div className="p-8">
            {/* Icon + title */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30
                flex items-center justify-center mb-4">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                  stroke="#f97316" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <h1 className="text-white font-bold text-xl">Admin Access</h1>
              <p className="text-zinc-500 text-sm mt-1">City Vape Management Panel</p>
            </div>

            {/* Error */}
            <AnimateError error={error} />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                    <UserIcon />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setError('') }}
                    placeholder="Enter username"
                    autoComplete="username"
                    className="w-full pl-11 pr-4 py-3 rounded-xl
                      bg-zinc-800 border border-zinc-700
                      text-white placeholder:text-zinc-600
                      focus:border-orange-500/60 focus:bg-zinc-800/80 focus:outline-none
                      transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                    <LockIcon />
                  </span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full pl-11 pr-11 py-3 rounded-xl
                      bg-zinc-800 border border-zinc-700
                      text-white placeholder:text-zinc-600
                      focus:border-orange-500/60 focus:bg-zinc-800/80 focus:outline-none
                      transition-all duration-200 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2
                      text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <EyeIcon open={showPass} />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 mt-2 rounded-xl font-bold text-sm
                  bg-orange-500 hover:bg-orange-600 text-white
                  disabled:opacity-60 disabled:cursor-not-allowed
                  transition-colors shadow-lg shadow-orange-500/25
                  flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Authenticating...
                  </>
                ) : 'Sign In'}
              </motion.button>
            </form>

            <p className="text-center text-xs text-zinc-600 mt-6">
              Protected area — authorized personnel only
            </p>
          </div>
        </div>

        {/* Back to store */}
        <div className="text-center mt-4">
          <a href="/" className="text-xs text-zinc-600 hover:text-orange-500 transition-colors">
            ← Back to Store
          </a>
        </div>
      </motion.div>
    </div>
  )
}

function AnimateError({ error }) {
  return (
    <div style={{ minHeight: error ? 'auto' : 0 }}>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30
            text-red-400 text-sm font-medium flex items-center gap-2"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {error}
        </motion.div>
      )}
    </div>
  )
}
