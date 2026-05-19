import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'
import { useAppStore } from '../store/useAppStore'
import Logo from './Logo'

// react-icons — only using packages guaranteed to exist in all versions
import { BsGrid, BsLightningChargeFill } from 'react-icons/bs'
import { FaHome, FaInstagram, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa'
import { HiMoon, HiSun, HiX } from 'react-icons/hi'
import { IoChatbubblesSharp } from 'react-icons/io5'
import { MdKeyboardArrowDown, MdOutlineDevicesOther, MdOutlineSettings } from 'react-icons/md'
import { TbBottle } from 'react-icons/tb'

/* ── collapsible nav group ──────────────────────────────────────── */
function NavGroup({ icon, label, children }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="sidebar-link w-full group"
      >
        <span className="text-orange-500">{icon}</span>
        <span className="flex-1 text-start">{label}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          className="text-zinc-400"
        >
          <MdKeyboardArrowDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ms-8 mt-0.5 border-s-2 border-orange-500/20 ps-3 space-y-0.5 pb-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── main sidebar ───────────────────────────────────────────────── */
export default function Sidebar() {
  const {
    sidebarOpen, setSidebarOpen,
    isDark, toggleTheme,
    language, setLanguage,
  } = useAppStore()
  const { t, isRTL } = useTranslation()
  const location = useLocation()

  // close on route change
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  // lock body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const active = (path) =>
    location.pathname === path ||
    (path !== '/' && location.pathname.startsWith(path))

  /* sub-link */
  const SubLink = ({ to, label }) => (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200
        ${active(to)
          ? 'text-orange-500 bg-orange-500/10 font-semibold'
          : 'text-zinc-500 dark:text-zinc-400 hover:text-orange-500 hover:bg-orange-500/10'
        }`}
    >
      {label}
    </Link>
  )

  /* nav link */
  const NavLink = ({ to, icon, label }) => (
    <Link to={to} className={`sidebar-link group ${active(to) ? 'active' : ''}`}>
      <span className="text-orange-500">{icon}</span>
      <span className="flex-1">{label}</span>
      {active(to) && (
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
      )}
    </Link>
  )

  /* shared content rendered in both mobile + desktop */
  const SidebarContent = () => (
    <div className="flex flex-col h-full" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── logo header ── */}
      <div className="flex items-center justify-between px-5 py-4
        border-b border-zinc-100 dark:border-zinc-800/80">
        <Link to="/" onClick={() => setSidebarOpen(false)}>
          <Logo size="md" />
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg
            hover:bg-zinc-100 dark:hover:bg-zinc-800
            text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200
            transition-colors"
        >
          <HiX size={20} />
        </button>
      </div>

      {/* ── navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">

        <p className="px-3 pb-2 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
          {t('home')}
        </p>

        <NavLink to="/" icon={<FaHome size={15} />} label={t('home')} />

        <p className="px-3 pt-4 pb-2 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
          {t('products')}
        </p>

        <NavLink to="/products" icon={<BsGrid size={15} />} label={t('allProducts')} />

        <NavGroup icon={<TbBottle size={16} />} label={t('eLiquid')}>
          <SubLink to="/products?category=freebase" label={t('freeBase')} />
          <SubLink to="/products?category=salt" label={t('saltNicotine')} />
        </NavGroup>

        <NavGroup icon={<MdOutlineDevicesOther size={17} />} label={t('devices')}>
          <SubLink to="/products?category=devices" label={t('modSystem')} />
          <SubLink to="/pod-system" label={t('podSystem')} />
        </NavGroup>

        <NavLink
          to="/products?category=disposables"
          icon={<BsLightningChargeFill size={14} />}
          label={t('disposables')}
        />

        <NavLink
          to="/products?category=coils"
          icon={<MdOutlineSettings size={17} />}
          label={t('coils')}
        />

        <p className="px-3 pt-4 pb-2 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
          {t('directions')}
        </p>

        <a
          href="https://maps.google.com/?q=33.518898,36.280708"
          target="_blank" rel="noopener noreferrer"
          className="sidebar-link"
        >
          <span className="text-orange-500"><FaMapMarkerAlt size={14} /></span>
          <span>{t('alJahiz')}</span>
        </a>

        <a
          href="https://maps.app.goo.gl/7Pwk6Y3beyesFKCF7"
          target="_blank" rel="noopener noreferrer"
          className="sidebar-link"
        >
          <span className="text-orange-500"><FaMapMarkerAlt size={14} /></span>
          <span>{t('masaken')}</span>
        </a>
        <a
          href="https://www.google.com/maps?q=33.521465,36.316658"
          target="_blank" rel="noopener noreferrer"
          className="sidebar-link"
        >
          <span className="text-orange-500"><FaMapMarkerAlt size={14} /></span>
          <span>{t('alQasaa')}</span>
        </a>
        <p className="px-3 pt-4 pb-2 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
          {t('contact')}
        </p>

        <NavLink
          to="/contact"
          icon={<IoChatbubblesSharp size={16} />}
          label={t('contact')}
        />

      </nav>

      {/* ── bottom controls ── */}
      <div className="px-4 pb-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">

        {/* social pills */}
        <div className="flex gap-2">
          <a
            href="https://wa.me/message/IXYMUJRDLYOXA1"
            target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
              bg-green-500/10 hover:bg-green-500/20
              text-green-600 dark:text-green-400
              text-xs font-semibold transition-colors"
          >
            <FaWhatsapp size={14} />
            <span>WhatsApp</span>
          </a>
          <a
            href="https://www.instagram.com/cityvpsy?igsh=MXVuejZkYnE4cXNrOQ=="
            target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
              bg-pink-500/10 hover:bg-pink-500/20
              text-pink-600 dark:text-pink-400
              text-xs font-semibold transition-colors"
          >
            <FaInstagram size={14} />
            <span>Instagram</span>
          </a>
        </div>

        {/* language + theme */}
        <div className="flex items-center gap-2">
          <div className="flex flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 gap-1">
            {['en', 'ar'].map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                  ${language === lang
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
              >
                {lang === 'en' ? 'EN' : 'عر'}
              </button>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800
              text-orange-500 hover:bg-orange-500/10 transition-colors"
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <HiSun size={17} /> : <HiMoon size={17} />}
          </button>
        </div>

      </div>
    </div>
  )

  return (
    <>
      {/* ── mobile backdrop ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── mobile drawer ── */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : isRTL ? '110%' : '-110%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className={`lg:hidden fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-72 z-50
          bg-white dark:bg-zinc-950
          ${isRTL ? 'border-l' : 'border-r'}
          border-zinc-200 dark:border-zinc-800
          shadow-2xl shadow-black/20`}
      >
        <SidebarContent />
      </motion.div>

      {/* ── desktop sticky sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 sticky top-0 h-screen
          bg-white dark:bg-zinc-950
          ${isRTL ? 'border-l' : 'border-r'}
          border-zinc-200 dark:border-zinc-800`}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
