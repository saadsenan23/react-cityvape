import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { useFirebaseProducts } from '../../store/useFirebaseProducts'
import { updateProduct, deleteProduct } from '../../services/productsService'

const CATEGORIES = [
  { value: 'all',         label: 'All'          },
  { value: 'freebase',    label: 'Free Base'    },
  { value: 'salt',        label: 'Salt'         },
  { value: 'disposables', label: 'Disposables'  },
  { value: 'devices',     label: 'Devices'      },
  { value: 'pod-system',  label: 'Pod System'   },
  { value: 'coils',       label: 'Coils'        },
]

const inputClass = `w-full px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700
  text-white placeholder:text-zinc-600 text-sm
  focus:border-orange-500/60 focus:outline-none transition-colors`

const SpinIcon = () => (
  <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
)

/* ── Edit modal ─────────────────────────────────────────────────── */
function EditModal({ product, onClose }) {
  const [form,   setForm]   = useState({
    name:     product.name     ?? '',
    price:    product.price    ?? '',
    category: product.category ?? 'freebase',
    ml:       product.ml       ?? '',
    nicotine: product.nicotine ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [err,    setErr]    = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name.trim()) { setErr('Name is required.'); return }
    if (!form.price.trim()) { setErr('Price is required.'); return }

    setSaving(true)
    setErr('')
    try {
      await updateProduct(product.id, form)
      onClose()
    } catch (e) {
      setErr(e.message || 'Failed to update. Try again.')
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-600" />
        <div className="p-6 space-y-4">

          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold">Edit Product</h3>
            <button onClick={onClose}
              className="text-zinc-500 hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {err && (
            <p className="text-red-400 text-xs px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
              {err}
            </p>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Name</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                className={inputClass} disabled={saving} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Price</label>
                <input value={form.price} onChange={e => set('price', e.target.value)}
                  className={inputClass} disabled={saving} />
              </div>
              <div>
                <label className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Category</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  className={`${inputClass} cursor-pointer`} disabled={saving}>
                  {CATEGORIES.filter(c => c.value !== 'all').map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Volume</label>
                <input value={form.ml} onChange={e => set('ml', e.target.value)}
                  placeholder="60ml" className={inputClass} disabled={saving} />
              </div>
              <div>
                <label className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1 block">Nicotine</label>
                <input value={form.nicotine} onChange={e => set('nicotine', e.target.value)}
                  placeholder="3mg" className={inputClass} disabled={saving} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm
                disabled:opacity-60 transition-colors">
              {saving ? <><SpinIcon /> Saving...</> : 'Save Changes'}
            </button>
            <button onClick={onClose} disabled={saving}
              className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700
                text-zinc-300 font-bold text-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Delete confirm modal ───────────────────────────────────────── */
function DeleteConfirm({ product, onDone, onCancel }) {
  const [deleting, setDeleting] = useState(false)
  const [err,      setErr]      = useState('')

  const handle = async () => {
    setDeleting(true)
    setErr('')
    try {
      await deleteProduct(product.id)
      onDone()
    } catch (e) {
      setErr(e.message || 'Failed to delete. Try again.')
      setDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black/70 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm">Delete Product?</p>
            <p className="text-zinc-500 text-xs">Removes from Firestore permanently</p>
          </div>
        </div>

        <p className="text-zinc-400 text-sm mb-5 leading-relaxed">
          Delete <span className="text-white font-semibold">"{product.name}"</span>?
          This cannot be undone.
        </p>

        {err && <p className="text-red-400 text-xs mb-3">{err}</p>}

        <div className="flex gap-3">
          <button onClick={handle} disabled={deleting}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
              bg-red-500 hover:bg-red-600 text-white font-bold text-sm
              disabled:opacity-60 transition-colors">
            {deleting ? <><SpinIcon /> Deleting...</> : 'Delete'}
          </button>
          <button onClick={onCancel} disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700
              text-zinc-300 font-bold text-sm transition-colors">
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
export default function AdminProductsPage() {
  const auth = useAdminAuth()
  const { firebaseProducts, loading } = useFirebaseProducts()

  const [search,    setSearch]    = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [editing,   setEditing]   = useState(null)  // product obj | null
  const [deleting,  setDeleting]  = useState(null)  // product obj | null

  if (!auth) return null

  const filtered = firebaseProducts.filter(p => {
    const matchCat    = catFilter === 'all' || p.category === catFilter
    const matchSearch = !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="space-y-5 max-w-5xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-extrabold">Firebase Products</h2>
          <p className="text-zinc-500 text-sm mt-0.5">
            {loading
              ? 'Syncing with Firestore...'
              : `${firebaseProducts.length} product${firebaseProducts.length !== 1 ? 's' : ''} in database`
            }
          </p>
        </div>
        <Link to="/admin/add"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm
            transition-colors shadow-lg shadow-orange-500/25">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add New
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/8
            text-white placeholder:text-zinc-600 text-sm
            focus:border-orange-500/50 focus:outline-none transition-colors"
        />
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => setCatFilter(c.value)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold
                transition-all duration-200
                ${catFilter === c.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-zinc-900 border border-white/8 text-zinc-400 hover:text-white'
                }`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading spinner */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <svg className="animate-spin text-orange-500" width="32" height="32"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            <p className="text-zinc-500 text-sm">Loading from Firebase...</p>
          </div>
        </div>

      ) : firebaseProducts.length === 0 ? (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-zinc-900 border border-white/8 rounded-2xl"
        >
          <div className="text-5xl mb-4">📦</div>
          <p className="text-white font-bold text-lg mb-2">No products yet</p>
          <p className="text-zinc-500 text-sm mb-6">
            Add a product — image goes to Cloudinary, data to Firestore
          </p>
          <Link to="/admin/add"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl
              bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add First Product
          </Link>
        </motion.div>

      ) : filtered.length === 0 ? (
        <p className="text-center py-16 text-zinc-500 text-sm">
          No products match your filter
        </p>

      ) : (
        /* Products table */
        <div className="bg-zinc-900 border border-white/8 rounded-2xl overflow-hidden">

          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4
            px-5 py-3 border-b border-white/8
            text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Details</span>
            <span>Actions</span>
          </div>

          <AnimatePresence>
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.22, delay: i * 0.02 }}
                className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_auto]
                  gap-3 sm:gap-4 items-center px-5 py-4
                  border-b border-white/5 last:border-0
                  hover:bg-white/3 transition-colors"
              >
                {/* Image + name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex-shrink-0
                    overflow-hidden border border-white/8">
                    {p.imageUrl || p.image ? (
                      <img
                        src={p.imageUrl || p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center
                        text-zinc-600 text-base">📦</div>
                    )}
                  </div>
                  <p className="text-white text-sm font-semibold truncate">{p.name}</p>
                </div>

                {/* Category */}
                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg
                  bg-orange-500/10 text-orange-400 text-[11px] font-semibold capitalize w-fit">
                  {p.category}
                </span>

                {/* Price */}
                <span className="text-orange-400 font-bold text-sm">{p.price}</span>

                {/* Details */}
                <div className="hidden sm:flex flex-col gap-0.5">
                  {p.ml       && <span className="text-zinc-500 text-xs">{p.ml}</span>}
                  {p.nicotine && <span className="text-zinc-500 text-xs">{p.nicotine}</span>}
                  {!p.ml && !p.nicotine && <span className="text-zinc-700 text-xs">—</span>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditing(p)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700
                      text-zinc-400 hover:text-orange-400 transition-colors"
                    title="Edit"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleting(p)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-red-500/15
                      text-zinc-400 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {editing  && (
          <EditModal
            product={editing}
            onClose={() => setEditing(null)}
          />
        )}
        {deleting && (
          <DeleteConfirm
            product={deleting}
            onDone={() => setDeleting(null)}
            onCancel={() => setDeleting(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
