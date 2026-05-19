import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { buildWhatsAppOrder } from '../utils/whatsapp'
import { useTranslation } from '../hooks/useTranslation'
import { LogoMark } from './Logo'
import { getImage } from '../assets/imageMap'

/* ── category badge colours ─────────────────────────────────────── */
const CAT_STYLE = {
  freebase:    'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  salt:        'bg-purple-500/15 text-purple-600 dark:text-purple-400',
  devices:     'bg-zinc-500/15 text-zinc-600 dark:text-zinc-300',
  disposables: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  coils:       'bg-amber-500/15 text-amber-600 dark:text-amber-400',
}
const CAT_LABEL = {
  freebase: 'Free Base', salt: 'Salt', devices: 'Device',
  disposables: 'Disposable', coils: 'Coils',
}

/* ── WhatsApp icon (tiny) ───────────────────────────────────────── */
const WAIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
)

/* ── placeholder when image fails ──────────────────────────────── */
const ImgPlaceholder = ({ name }) => (
  <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3">
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.2" strokeLinecap="round"
      className="text-zinc-300 dark:text-zinc-600">
      <rect x="9" y="2" width="6" height="18" rx="3"/>
      <path d="M9 8h6M9 12h6" opacity="0.5"/>
    </svg>
    <span className="text-[10px] text-center text-zinc-400 dark:text-zinc-500 leading-tight line-clamp-2">
      {name}
    </span>
  </div>
)

/* ═══════════════════════════════════════════════════════════════ */
export default function ProductCard({ product, index = 0 }) {
  const [imgErr, setImgErr]     = useState(false)
  const [imgLoaded, setLoaded]  = useState(false)
  const { setSelectedProduct }  = useAppStore()
  const { t }                   = useTranslation()

  const imgSrc = getImage(product.imageUrl || product.image)

  const handleBuy = (e) => {
    e.stopPropagation()
    window.open(buildWhatsAppOrder(product), '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: Math.min(index * 0.035, 0.45), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={() => setSelectedProduct(product)}
      className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden
        border border-zinc-100 dark:border-zinc-800
        shadow-sm hover:shadow-xl hover:shadow-orange-500/10
        cursor-pointer transition-shadow duration-300"
    >
      {/* ── Image area ─────────────────────────────────────── */}
      <div className="relative aspect-square overflow-hidden bg-zinc-50 dark:bg-zinc-800">

        {/* skeleton */}
        {!imgLoaded && !imgErr && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700" />
        )}

        {/* image */}
        {!imgErr ? (
          <img
            src={imgSrc}
            alt={product.name}
            onLoad={() => setLoaded(true)}
            onError={() => setImgErr(true)}
            className={`w-full h-full object-cover
              transition-all duration-500 group-hover:scale-110
              ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <ImgPlaceholder name={product.name} />
        )}

        {/* ── Logo mark overlay (top-right) ── */}
        <div className="absolute top-2 right-2 opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-lg">
          <LogoMark size={24} />
        </div>

        {/* ── Category badge (top-left) ── */}
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold
            ${CAT_STYLE[product.category] || 'bg-zinc-100 text-zinc-500'}`}>
            {CAT_LABEL[product.category] || product.category}
          </span>
        </div>

        {/* ── Hover buy overlay ── */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0
          transition-transform duration-300 ease-out">
          <button
            onClick={handleBuy}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white
              text-[11px] font-bold tracking-wide uppercase
              flex items-center justify-center gap-1.5 transition-colors"
          >
            <WAIcon />
            {t('buyNow')}
          </button>
        </div>

        {/* subtle orange glow on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
          pointer-events-none ring-2 ring-orange-400/30" />
      </div>

      {/* ── Card body ──────────────────────────────────────── */}
      <div className="p-3">
        {/* Name */}
        <h3 className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-100 leading-tight line-clamp-2 mb-2 min-h-[2.2rem]">
          {product.name}
        </h3>

        {/* ml + nicotine badges */}
        {(product.ml || product.nicotine) && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.ml && (
              <span className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                {product.ml}
              </span>
            )}
            {product.nicotine && (
              <span className="px-1.5 py-0.5 rounded-md bg-orange-500/10 text-[10px] font-medium text-orange-600 dark:text-orange-400">
                {product.nicotine}
              </span>
            )}
          </div>
        )}

        {/* Price + Buy row */}
        <div className="flex items-center justify-between gap-1.5">
          <span className="text-[15px] font-extrabold text-orange-500 tracking-tight">
            {product.price}
          </span>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleBuy}
            className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5
              rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors
              shadow-sm shadow-orange-500/25"
          >
            <WAIcon />
            {t('buyNow')}
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
