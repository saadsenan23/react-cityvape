import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { buildWhatsAppOrder } from '../utils/whatsapp'
import { useTranslation } from '../hooks/useTranslation'
import { LogoMark } from './Logo'
import { getImage } from '../assets/imageMap'

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const WAIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
)

const CAT_COLOR = {
  freebase: 'bg-blue-500/15 text-blue-600 dark:text-blue-300',
  salt: 'bg-purple-500/15 text-purple-600 dark:text-purple-300',
  devices: 'bg-zinc-500/15 text-zinc-600 dark:text-zinc-300',
  disposables: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
  coils: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
}

export default function ProductModal() {
  const { selectedProduct, setSelectedProduct } = useAppStore()
  const { t } = useTranslation()
  const [imgErr, setImgErr] = useState(false)

  const close = () => setSelectedProduct(null)

  const handleBuy = () => {
    window.open(buildWhatsAppOrder(selectedProduct), '_blank', 'noopener,noreferrer')
  }

  const imgSrc = getImage(selectedProduct?.imageUrl || selectedProduct?.image || '')

  return (
    <AnimatePresence>
      {selectedProduct && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center
            sm:p-4 bg-black/65 backdrop-blur-sm"
        >
          <motion.div
            key="modal-panel"
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={e => e.stopPropagation()}
            className="w-full sm:max-w-sm bg-white dark:bg-zinc-900
              rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* ── Image ── */}
            <div className="relative aspect-[5/4] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              {!imgErr ? (
                <img
                  src={imgSrc}
                  alt={selectedProduct.name}
                  onError={() => setImgErr(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                    className="text-zinc-300 dark:text-zinc-600">
                    <rect x="9" y="2" width="6" height="18" rx="3"/>
                  </svg>
                </div>
              )}

              {/* Logo mark top-right */}
              <div className="absolute top-3 right-3 drop-shadow-lg">
                <LogoMark size={32} />
              </div>

              {/* Close */}
              <button
                onClick={close}
                className="absolute top-3 left-3 p-2 rounded-xl
                  bg-black/35 hover:bg-black/55 text-white backdrop-blur-sm transition-colors"
              >
                <XIcon />
              </button>

              {/* Gradient */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* ── Details ── */}
            <div className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-1">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-2
                    ${CAT_COLOR[selectedProduct.category] || 'bg-zinc-100 text-zinc-500'}`}>
                    {selectedProduct.category}
                  </span>
                  <h2 className="text-base font-bold text-zinc-900 dark:text-white leading-snug">
                    {selectedProduct.name}
                  </h2>
                </div>
                <span className="text-2xl font-extrabold text-orange-500 whitespace-nowrap">
                  {selectedProduct.price}
                </span>
              </div>

              {/* ml + nicotine */}
              {(selectedProduct.ml || selectedProduct.nicotine) && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {selectedProduct.ml && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                      <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
                        📦 {selectedProduct.ml}
                      </span>
                    </div>
                  )}
                  {selectedProduct.nicotine && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10">
                      <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                        💧 {selectedProduct.nicotine}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleBuy}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl
                  bg-orange-500 hover:bg-orange-600 text-white font-bold text-[15px]
                  transition-colors shadow-lg shadow-orange-500/30"
              >
                <WAIcon />
                {t('buyNow')} — {selectedProduct.price}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
