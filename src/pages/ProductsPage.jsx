import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { useTranslation } from '../hooks/useTranslation'
import ProductCard from '../components/ProductCard'
import { products, categories } from '../assets/products'
import { useFirebaseProducts } from '../store/useFirebaseProducts'

const ITEMS_PER_PAGE = 40

export default function ProductsPage() {
  const { searchQuery, activeCategory, setActiveCategory } = useAppStore()
  const { t, isRTL } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const { firebaseProducts } = useFirebaseProducts()

  // Merge static + Firebase products
  const allProducts = useMemo(
    () => [...products, ...firebaseProducts],
    [firebaseProducts]
  )

  // Sync category from URL param on mount / URL change
  useEffect(() => {
    const urlCat = searchParams.get('category')
    if (urlCat) {
      // pod-system has its own dedicated page — redirect there
      if (urlCat === 'pod-system') {
        navigate('/pod-system', { replace: true })
        return
      }
      setActiveCategory(urlCat)
    } else {
      // no category param → show all
      setActiveCategory('all')
    }
  }, [searchParams]) // eslint-disable-line

  // Reset page when filter changes
  useEffect(() => { setPage(1) }, [activeCategory, searchQuery])

  const handleCategoryChange = (catId) => {
    // pod-system gets its own page
    if (catId === 'pod-system') {
      navigate('/pod-system')
      return
    }
    setActiveCategory(catId)
    setPage(1)
    if (catId === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ category: catId })
    }
  }

  // Filter — exclude pod-system from this page (it has its own)
  const filtered = useMemo(() => {
    let result = allProducts.filter(p => p.category !== 'pod-system')
    if (activeCategory && activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q))
    }
    return result
  }, [activeCategory, searchQuery])

  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE)
  const hasMore   = paginated.length < filtered.length

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">

        {/* Page header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-zinc-900 dark:text-white mb-1"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
          >
            {t('allProducts')}
          </h1>
          <p className="text-sm text-zinc-400">
            {filtered.length} {isRTL ? 'منتج' : 'products'}
            {activeCategory !== 'all' && ` — ${activeCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold
                transition-all duration-200
                ${activeCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
            >
              {isRTL ? cat.labelAr : cat.label}
              {activeCategory === cat.id && filtered.length > 0 && (
                <span className="ms-1.5 text-orange-100 text-xs">
                  ({filtered.length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800
                flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5"
                  className="text-zinc-300 dark:text-zinc-600">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </div>
              <p className="font-semibold text-zinc-500 dark:text-zinc-400">
                {t('noResults')}
              </p>
              <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
                {t('noResultsDesc')}
              </p>
              <button
                onClick={() => handleCategoryChange('all')}
                className="mt-4 text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                {isRTL ? 'مسح الفلتر' : 'Clear filters'}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${activeCategory}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="product-grid"
            >
              {paginated.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load more */}
        {hasMore && (
          <div className="flex justify-center mt-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPage(p => p + 1)}
              className="btn-primary"
            >
              {isRTL ? 'تحميل المزيد' : 'Load More'} ({filtered.length - paginated.length} {isRTL ? 'متبقي' : 'remaining'})
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}
