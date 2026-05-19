import { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdminStore } from '../../store/useAdminStore'

/* ── icons ─────────────────────────────────────────────────────── */
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const Icons = {
  Dashboard: () => <Icon d="M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z" />,
  Products:  () => <Icon d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />,
  Add:       () => <Icon d="M12 5v14 M5 12h14" />,
  Logout:    () => <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" />,
  Menu:      () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  X:         () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Store:     () => <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  Shield:    () => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
}

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard',    icon: <Icons.Dashboard /> },
  { to: '/admin/products',  label: 'All Products', icon: <Icons.Products /> },
  { to: '/admin/add',       label: 'Add Product',  icon: <Icons.Add /> },
]

/* ── nav link ───────────────────────────────────────────────────── */
function AdminNavLink({ to, icon, label, onClick }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm
        transition-all duration-200
        ${isActive
          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
          : 'text-zinc-400 hover:text-white hover:bg-white/8'
        }`}
    >
      <span className={isActive ? 'text-white' : 'text-zinc-500'}>{icon}</span>
      {label}
    </Link>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
export default function AdminLayout() {
  const { logout, getStats } = useAdminStore()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const stats = getStats()

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
            <Icons.Shield />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">City Vape</p>
            <p className="text-orange-400 text-[11px] font-semibold tracking-widest uppercase mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
          Management
        </p>
        {navItems.map(item => (
          <AdminNavLink
            key={item.to}
            {...item}
            onClick={() => setMobileOpen(false)}
          />
        ))}

        <div className="pt-6">
          <p className="px-3 pb-2 text-[10px] font-bold tracking-widest text-zinc-600 uppercase">
            Store
          </p>
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm
              text-zinc-400 hover:text-white hover:bg-white/8 transition-all duration-200"
          >
            <span className="text-zinc-500"><Icons.Store /></span>
            View Store
          </Link>
        </div>
      </nav>

      {/* Stats pill */}
      <div className="px-4 py-3 mx-3 mb-3 rounded-xl bg-white/5 border border-white/10">
        <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-2">Quick Stats</p>
        <div className="flex justify-between">
          <div className="text-center">
            <p className="text-orange-400 font-bold text-lg leading-none">{stats.total}</p>
            <p className="text-zinc-600 text-[10px] mt-0.5">Total</p>
          </div>
          <div className="text-center">
            <p className="text-orange-400 font-bold text-lg leading-none">{stats.adminAdded}</p>
            <p className="text-zinc-600 text-[10px] mt-0.5">Added</p>
          </div>
          <div className="text-center">
            <p className="text-orange-400 font-bold text-lg leading-none">
              {Object.keys(stats.byCategory).length}
            </p>
            <p className="text-zinc-600 text-[10px] mt-0.5">Cats</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
            text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <Icons.Logout />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-zinc-950">

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <motion.div
        initial={false}
        animate={{ x: mobileOpen ? 0 : '-110%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="lg:hidden fixed top-0 left-0 h-full w-64 z-50
          bg-zinc-900 border-r border-white/10 shadow-2xl"
      >
        <SidebarContent />
      </motion.div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0
        bg-zinc-900 border-r border-white/10 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-xl
          border-b border-white/8 px-4 sm:px-6 py-3 flex items-center gap-4">

          <button
            onClick={() => setMobileOpen(v => !v)}
            className="lg:hidden p-2 rounded-xl text-zinc-400
              hover:text-white hover:bg-white/8 transition-colors"
          >
            <Icons.Menu />
          </button>

          <div className="flex-1">
            <PageTitle />
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl
              bg-orange-500/10 border border-orange-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-orange-400 text-xs font-semibold">Admin</span>
            </div>
          </div>
        </header>

        {/* Page content with transition */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function PageTitle() {
  const location = useLocation()
  const titles = {
    '/admin/dashboard': 'Dashboard',
    '/admin/products':  'All Products',
    '/admin/add':       'Add Product',
  }
  const title = titles[location.pathname] || 'Admin'
  return (
    <h1 className="text-white font-bold text-base">{title}</h1>
  )
}
