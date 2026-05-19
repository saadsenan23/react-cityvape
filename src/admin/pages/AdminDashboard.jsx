import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdminStore } from '../../store/useAdminStore'
import { useFirebaseProducts } from '../../store/useFirebaseProducts'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { categories, products as staticProducts } from '../../assets/products'

const StatCard = ({ label, value, sub, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-zinc-900 border border-white/8 rounded-2xl p-5"
  >
    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4 flex-shrink-0"
      style={{ background: color }}>
      {icon}
    </div>
    <p className="text-3xl font-extrabold text-white mb-1"
      style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
      {value}
    </p>
    <p className="text-sm font-semibold text-zinc-300">{label}</p>
    {sub && <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>}
  </motion.div>
)

const QuickAction = ({ to, icon, label, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Link to={to}
      className="flex items-center gap-4 p-4 rounded-2xl
        bg-zinc-900 border border-white/8
        hover:border-orange-500/40 hover:bg-zinc-900/80
        transition-all duration-200 group">
      <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/25
        flex items-center justify-center text-orange-500 flex-shrink-0
        group-hover:bg-orange-500 group-hover:text-white transition-all duration-200">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm">{label}</p>
        <p className="text-zinc-500 text-xs mt-0.5 truncate">{desc}</p>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round"
        className="text-zinc-700 group-hover:text-orange-500 transition-colors flex-shrink-0">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </Link>
  </motion.div>
)

export default function AdminDashboard() {
  const auth = useAdminAuth()
  const { getStats } = useAdminStore()
  const { firebaseProducts, loading } = useFirebaseProducts()

  if (!auth) return null

  const stats       = getStats(firebaseProducts)
  const allProducts = [...staticProducts, ...firebaseProducts]
  const recent      = firebaseProducts.slice(0, 5)

  const catBreakdown = categories
    .filter(c => c.id !== 'all')
    .map(c => ({
      ...c,
      count: allProducts.filter(p => p.category === c.id).length,
    }))
    .sort((a, b) => b.count - a.count)

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-white text-2xl font-extrabold"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
            Welcome back, Admin 👋
          </h2>
          <p className="text-zinc-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link to="/admin/add"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm
            transition-colors shadow-lg shadow-orange-500/25">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Product
        </Link>
      </motion.div>

      {/* Firebase status banner */}
      {loading && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 border border-white/8">
          <svg className="animate-spin text-orange-500 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          <span className="text-zinc-400 text-sm">Connecting to Firebase...</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard delay={0}    label="Total Products"   value={stats.total}          sub="Static + Firebase" icon="📦" color="rgba(249,115,22,0.15)" />
        <StatCard delay={0.07} label="Firebase Products" value={stats.firebaseAdded} sub="Synced in real-time" icon="🔥" color="rgba(59,130,246,0.15)"  />
        <StatCard delay={0.14} label="Static Products"  value={staticProducts.length} sub="From codebase"     icon="📁" color="rgba(168,85,247,0.15)"  />
        <StatCard delay={0.21} label="Categories"       value={catBreakdown.length}  sub="Product types"      icon="🏷️" color="rgba(34,197,94,0.15)"   />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Quick actions */}
        <div>
          <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <QuickAction delay={0.1} to="/admin/add"
              label="Add New Product"
              desc="Upload image + save to Firebase"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}
            />
            <QuickAction delay={0.15} to="/admin/products"
              label="Manage Firebase Products"
              desc={`${stats.firebaseAdded} products — edit & delete`}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
            />
            <QuickAction delay={0.2} to="/"
              label="View Live Store"
              desc="Opens in same tab"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>}
            />
          </div>
        </div>

        {/* Category breakdown */}
        <div>
          <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3">Products by Category</h3>
          <div className="bg-zinc-900 border border-white/8 rounded-2xl p-4 space-y-3">
            {catBreakdown.map((cat, i) => {
              const pct = stats.total > 0 ? Math.round((cat.count / stats.total) * 100) : 0
              return (
                <motion.div key={cat.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-zinc-300 text-xs font-medium">{cat.label}</span>
                    <span className="text-zinc-500 text-xs">{cat.count}</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.06 }}
                      className="h-full bg-orange-500 rounded-full"
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Firebase products */}
      {recent.length > 0 && (
        <div>
          <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3">
            Recently Added to Firebase
          </h3>
          <div className="bg-zinc-900 border border-white/8 rounded-2xl overflow-hidden">
            {recent.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 px-5 py-3.5 border-b border-white/5 last:border-0">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex-shrink-0 overflow-hidden">
                  {p.image
                    ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-zinc-600 text-lg">📦</div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-zinc-500 text-xs mt-0.5 capitalize">{p.category}</p>
                </div>
                <span className="text-orange-400 font-bold text-sm flex-shrink-0">{p.price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
