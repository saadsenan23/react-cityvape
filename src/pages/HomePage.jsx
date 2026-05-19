import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from '../hooks/useTranslation'
import { useAppStore } from '../store/useAppStore'
import ProductCard from '../components/ProductCard'
import { products, categories } from '../assets/products'

// react-icons
import { TbBottle }           from 'react-icons/tb'
import { GiChemicalDrop }     from 'react-icons/gi'
import { BsLightningChargeFill } from 'react-icons/bs'
import { MdOutlineDevicesOther } from 'react-icons/md'
import { MdOutlineSettings }  from 'react-icons/md'
import { FaStar, FaBoxOpen }  from 'react-icons/fa'
import { IoFlash }             from 'react-icons/io5'
import { IoChatbubblesSharp }  from 'react-icons/io5'
import { FaWhatsapp }          from 'react-icons/fa'

const featuredProducts = products.slice(0, 8)

/* ── feature card ───────────────────────────────────────────────── */
const FeatureCard = ({ icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
  >
    <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 flex-shrink-0 text-xl">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-zinc-900 dark:text-white text-sm mb-1">{title}</h3>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  </motion.div>
)

/* ── category definitions with react-icons ──────────────────────── */
const categoryVisuals = [
  { id: 'freebase',    icon: <TbBottle size={28} />,              label: 'Free Base',   labelAr: 'فري بيس'       },
  { id: 'salt',        icon: <GiChemicalDrop size={28} />,        label: 'Salt',        labelAr: 'سولت نيكوتين'  },
  { id: 'disposables', icon: <BsLightningChargeFill size={26} />, label: 'Disposables', labelAr: 'ديسبوزابل'     },
  { id: 'devices',     icon: <MdOutlineDevicesOther size={28} />, label: 'Devices',     labelAr: 'الأجهزة'       },
  { id: 'pod-system',  icon: <MdOutlineDevicesOther size={28} />, label: 'Pod System',  labelAr: 'بود سيستم'     },
  { id: 'coils',       icon: <MdOutlineSettings size={28} />,     label: 'Coils',       labelAr: 'كويلز وبودز'   },
]

/* ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const { t, isRTL } = useTranslation()
  const { setActiveCategory } = useAppStore()

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative hero-gradient overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl" />
          <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-orange-400/5 blur-3xl" />
        </div>

        <div className="relative max-w-screen-xl mx-auto px-6 py-16 sm:py-24 flex flex-col items-center text-center">

          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full
              bg-orange-500/10 border border-orange-500/20
              text-orange-600 dark:text-orange-400 text-xs font-semibold mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Damascus, Syria – Premium Vaping Store
          </motion.div>

          {/* title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
            className="text-5xl sm:text-7xl md:text-8xl text-zinc-900 dark:text-white mb-4 leading-none"
          >
            {t('heroTitle')}{' '}
            <span className="gradient-text">{t('heroTitleAccent')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-lg mb-10 leading-relaxed"
          >
            {t('heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <Link to="/products" className="btn-primary text-sm">
              {t('shopNow')} →
            </Link>
            <a
              href="https://wa.me/message/IXYMUJRDLYOXA1"
              target="_blank" rel="noopener noreferrer"
              className="btn-ghost text-sm"
            >
              {t('contactUs')}
            </a>
          </motion.div>

          {/* stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-8 mt-14 pt-10 border-t border-zinc-100 dark:border-zinc-800 w-full max-w-sm justify-center"
          >
            {[
              { value: '300+', label: 'Products'   },
              { value: '6',    label: 'Categories' },
              { value: '2',    label: 'Locations'  },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-2xl font-bold text-orange-500"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">{t('categories')}</h2>
          <Link
            to="/products"
            className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            {t('viewAll')} →
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {categoryVisuals.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
            >
              <Link
                to={cat.id === 'pod-system' ? '/pod-system' : `/products?category=${cat.id}`}
                onClick={() => cat.id !== 'pod-system' && setActiveCategory(cat.id)}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl
                  bg-gradient-to-b from-orange-500/10 to-orange-500/5
                  border border-orange-500/20
                  hover:border-orange-500/50 hover:from-orange-500/20
                  hover:shadow-lg hover:shadow-orange-500/10
                  transition-all duration-250 group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 group-hover:bg-orange-500/20
                  flex items-center justify-center text-orange-500 transition-colors duration-200">
                  {cat.icon}
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-orange-500 text-center leading-tight">
                  {isRTL ? cat.labelAr : cat.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 py-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">{t('featuredProducts')}</h2>
          <Link
            to="/products"
            className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            {t('viewAll')} →
          </Link>
        </div>

        <div className="product-grid">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link to="/products" className="btn-primary">
            {t('viewAll')} — {products.length} {t('allProducts')}
          </Link>
        </div>
      </section>

      {/* ── Why Us ───────────────────────────────────────────── */}
      <section className="bg-zinc-50 dark:bg-zinc-900/50 py-16">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="section-title text-center mb-10">{t('whyUs')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard delay={0}   icon={<FaStar size={18} />}            title={t('premiumQuality')} desc={t('premiumQualityDesc')} />
            <FeatureCard delay={0.1} icon={<IoFlash size={20} />}           title={t('fastDelivery')}   desc={t('fastDeliveryDesc')} />
            <FeatureCard delay={0.2} icon={<IoChatbubblesSharp size={19} />} title={t('expertSupport')}  desc={t('expertSupportDesc')} />
            <FeatureCard delay={0.3} icon={<FaBoxOpen size={19} />}         title={t('wideSelection')}  desc={t('wideSelectionDesc')} />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700 p-8 sm:p-12 text-center orange-glow"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
          </div>
          <div className="relative">
            <h2
              className="text-2xl sm:text-4xl font-bold text-white mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}
            >
              ORDER NOW VIA WHATSAPP
            </h2>
            <p className="text-orange-100 text-sm mb-8 max-w-md mx-auto">
              Fast delivery across Damascus. Message us and get your order today.
            </p>
            <a
              href="https://wa.me/message/IXYMUJRDLYOXA1"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl
                bg-white text-orange-600 font-bold text-sm
                hover:bg-orange-50 transition-colors shadow-lg"
            >
              <FaWhatsapp size={20} />
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
