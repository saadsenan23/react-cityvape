import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Footer from './Footer'
import ProductModal from './ProductModal'
import { useTranslation } from '../hooks/useTranslation'
import { useAdminShortcut } from '../admin/hooks/useAdminShortcut'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export default function Layout() {
  const { isRTL } = useTranslation()
  const location = useLocation()
  useAdminShortcut() // Ctrl+Shift+A → /admin/login

  return (
    <div
      className={`min-h-screen flex bg-zinc-50 dark:bg-zinc-950 ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>

        <Footer />
      </div>

      <ProductModal />
    </div>
  )
}
