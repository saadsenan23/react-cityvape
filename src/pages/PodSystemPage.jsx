import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from '../hooks/useTranslation'
import { useAppStore } from '../store/useAppStore'
import ProductCard from '../components/ProductCard'
import { podSystemProducts } from '../assets/products'
import { useFirebaseProducts } from '../store/useFirebaseProducts'
import { MdOutlineDevicesOther } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'
import { BsLightningChargeFill } from 'react-icons/bs'

/* ── brand filter tabs ──────────────────────────────────────────── */
const brands = [
  { id: 'all',       label: 'All Brands', labelAr: 'جميع الماركات' },
  { id: 'oxva',      label: 'OXVA',       labelAr: 'أوكسفا'        },
  { id: 'uwell',     label: 'Uwell',      labelAr: 'يوويل'         },
  { id: 'vaporesso', label: 'Vaporesso',  labelAr: 'فابوريسو'      },
  { id: 'nexlim',    label: 'Nexlim',     labelAr: 'نيكسليم'       },
]

function getBrand(name) {
  const n = name.toLowerCase()
  if (n.includes('oxva'))                         return 'oxva'
  if (n.includes('uwell') || n.includes('caliburn')) return 'uwell'
  if (n.includes('vaporesso'))                    return 'vaporesso'
  if (n.includes('nexlim'))                       return 'nexlim'
  return 'other'
}

/* ── small stat card ────────────────────────────────────────────── */
const StatCard = ({ icon, value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="flex flex-col items-center gap-1 p-4 rounded-2xl
      bg-white dark:bg-zinc-900
      border border-zinc-100 dark:border-zinc-800 shadow-sm"
  >
    <span className="text-orange-500 text-xl">{icon}</span>
    <span
      className="text-xl font-extrabold text-zinc-900 dark:text-white"
      style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}
    >
      {value}
    </span>
    <span className="text-[11px] text-zinc-400 text-center">{label}</span>
  </motion.div>
)

/* ═══════════════════════════════════════════════════════════════ */
export default function PodSystemPage() {
  const { isRTL } = useTranslation()
  const { searchQuery } = useAppStore()
  const [activeBrand, setActiveBrand] = useState('all')
  const { firebaseProducts } = useFirebaseProducts()

  // Merge static + Firebase pod-system products
  const allPodProducts = useMemo(
    () => [...podSystemProducts, ...firebaseProducts.filter(p => p.category === 'pod-system')],
    [firebaseProducts]
  )

  /* filter products */
  const filtered = allPodProducts.filter(p => {
    const matchBrand  = activeBrand === 'all' || getBrand(p.name) === activeBrand
    const matchSearch = !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchBrand && matchSearch
  })

  const prices   = allPodProducts.map(p => parseFloat(p.price))
  const minPrice = Math.min(...prices)

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-orange-500/5 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-64 h-64 rounded-full bg-orange-400/5 blur-3xl" />
        </div>

        <div className="relative max-w-screen-xl mx-auto px-6 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">

            {/* left */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                  bg-orange-500/10 border border-orange-500/20
                  text-orange-500 text-xs font-bold mb-4"
              >
                <MdOutlineDevicesOther size={13} />
                {isRTL ? 'تشكيلة بود سيستم' : 'Pod System Collection'}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
                className="text-5xl sm:text-6xl text-zinc-900 dark:text-white leading-none mb-3"
              >
                {isRTL ? (
                  <>بود <span className="gradient-text">سيستم</span></>
                ) : (
                  <>Pod <span className="gradient-text">System</span></>
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md leading-relaxed mb-6"
              >
                {isRTL
                  ? 'أجهزة بود سيستم الاحترافية من أفضل الماركات العالمية. جودة عالية وأداء استثنائي.'
                  : "Professional pod systems from the world's top brands — OXVA, Uwell, Vaporesso & more."}
              </motion.p>

              <motion.a
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                href="https://wa.me/message/IXYMUJRDLYOXA1"
                target="_blank" rel="noopener noreferrer"
                className="btn-primary text-sm"
              >
                <FaWhatsapp size={15} />
                {isRTL ? 'تواصل معنا' : 'Order via WhatsApp'}
              </motion.a>
            </div>

            {/* right — stats */}
            <div className="grid grid-cols-3 sm:grid-cols-1 gap-3 sm:w-36 flex-shrink-0">
              <StatCard
                icon={<MdOutlineDevicesOther size={20} />}
                value={allPodProducts.length}
                label={isRTL ? 'منتج' : 'Products'}
                delay={0.25}
              />
              <StatCard
                icon={<BsLightningChargeFill size={18} />}
                value={`${minPrice}$`}
                label={isRTL ? 'يبدأ من' : 'Starting at'}
                delay={0.32}
              />
              <StatCard
                icon="🏆"
                value="4"
                label={isRTL ? 'ماركات' : 'Brands'}
                delay={0.38}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand tabs ────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-6 py-5">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {brands.map((brand, i) => (
            <motion.button
              key={brand.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => setActiveBrand(brand.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold
                transition-all duration-200
                ${activeBrand === brand.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-orange-500/40 hover:text-orange-500'
                }`}
            >
              {isRTL ? brand.labelAr : brand.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Products ──────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 pb-16">

        {/* count row */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            <span className="font-bold text-zinc-900 dark:text-white">{filtered.length}</span>
            {' '}{isRTL ? 'منتج' : 'products'}
            {activeBrand !== 'all' && (
              <span className="text-orange-500 font-semibold ms-1">
                — {brands.find(b => b.id === activeBrand)?.[isRTL ? 'labelAr' : 'label']}
              </span>
            )}
          </p>
          {activeBrand !== 'all' && (
            <button
              onClick={() => setActiveBrand('all')}
              className="text-xs text-zinc-400 hover:text-orange-500 transition-colors font-medium"
            >
              {isRTL ? 'مسح ×' : 'Clear ×'}
            </button>
          )}
        </div>

        {/* grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800
              flex items-center justify-center mb-4">
              <MdOutlineDevicesOther size={28} className="text-zinc-300 dark:text-zinc-600" />
            </div>
            <p className="font-semibold text-zinc-500 dark:text-zinc-400 text-sm">
              {isRTL ? 'لا توجد منتجات' : 'No products found'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={activeBrand}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="product-grid"
          >
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        )}
      </section>

      {/* ── CTA banner ────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl
            bg-gradient-to-br from-orange-500 to-orange-700
            p-8 sm:p-10 text-center orange-glow"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5 blur-2xl" />
          </div>
          <div className="relative">
            <h2
              className="text-2xl sm:text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}
            >
              {isRTL ? 'اطلب جهازك الآن' : 'ORDER YOUR DEVICE NOW'}
            </h2>
            <p className="text-orange-100 text-sm mb-6 max-w-xs mx-auto">
              {isRTL
                ? 'توصيل سريع في دمشق — تواصل معنا عبر واتساب'
                : 'Fast delivery across Damascus — chat with us on WhatsApp'}
            </p>
            <a
              href="https://wa.me/message/IXYMUJRDLYOXA1"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl
                bg-white text-orange-600 font-bold text-sm
                hover:bg-orange-50 transition-colors shadow-lg"
            >
              <FaWhatsapp size={18} />
              {isRTL ? 'ابدأ المحادثة' : 'Start Chat'}
            </a>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
