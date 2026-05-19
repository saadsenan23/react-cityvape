import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import Logo from './Logo'

export default function AgeGate() {
  const { ageVerified, setAgeVerified } = useAppStore()

  const confirm = () => setAgeVerified(true)
  const exit    = () => { window.location.href = 'https://www.google.com' }

  return (
    <AnimatePresence>
      {!ageVerified && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(24px)' }}
        >
          {/* decorative rings */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-[600px] h-[600px] rounded-full border border-orange-500/10 animate-[spin_20s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-[400px] h-[400px] rounded-full border border-orange-500/15 animate-[spin_14s_linear_infinite_reverse]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-72 h-72 rounded-full bg-orange-500/5 blur-3xl" />
          </div>

          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative w-full max-w-sm overflow-hidden"
          >
            {/* card */}
            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl shadow-black/60">

              {/* top accent bar */}
              <div className="h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

              {/* top image strip */}
              <div className="relative h-28 bg-gradient-to-br from-orange-500/20 via-orange-600/10 to-zinc-900/20
                flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.2),transparent_70%)]" />
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Logo size="lg" />
                </motion.div>
              </div>

              <div className="px-7 pb-7 pt-5">
                {/* shield icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                      stroke="#f97316" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="M9 12l2 2 4-4"/>
                    </svg>
                  </div>
                </div>

                {/* text */}
                <h2 className="text-center text-xl font-extrabold text-zinc-900 dark:text-white mb-1">
                  Age Verification
                </h2>
                <p className="text-center text-[13px] text-zinc-500 dark:text-zinc-400 mb-1 leading-relaxed">
                  This website contains products intended for adults only.
                </p>
                <p className="text-center text-[13px] text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed" dir="rtl">
                  هذا الموقع يحتوي على منتجات مخصصة للبالغين فقط (+18).
                </p>

                {/* 18+ badge */}
                <div className="flex justify-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                    bg-orange-500/10 border border-orange-500/30">
                    <span className="text-orange-500 font-black text-lg">18+</span>
                    <span className="text-zinc-500 dark:text-zinc-400 text-xs">Required</span>
                  </div>
                </div>

                {/* buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={confirm}
                    className="flex-1 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600
                      text-white font-bold text-sm transition-colors
                      shadow-lg shadow-orange-500/35"
                  >
                    I'm 18+ — Enter
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={exit}
                    className="flex-1 py-3.5 rounded-2xl
                      bg-zinc-100 dark:bg-zinc-800
                      hover:bg-zinc-200 dark:hover:bg-zinc-700
                      text-zinc-600 dark:text-zinc-300 font-bold text-sm transition-colors"
                  >
                    Exit
                  </motion.button>
                </div>

                <p className="text-center text-[11px] text-zinc-400 mt-4">
                  By entering you confirm you are 18+ and agree to our terms.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
