import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { useTranslation } from '../hooks/useTranslation'
import Logo from './Logo'

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const WAIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
)

export default function Navbar() {
  const { toggleSidebar, searchQuery, setSearchQuery } = useAppStore()
  const { t, isRTL } = useTranslation()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl
      border-b border-zinc-200/70 dark:border-zinc-800/70">
      <div className="flex items-center gap-3 px-4 py-3 max-w-screen-xl mx-auto">

        {/* Hamburger — mobile only */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={toggleSidebar}
          className="lg:hidden flex-shrink-0 p-2 rounded-xl
            hover:bg-zinc-100 dark:hover:bg-zinc-800
            text-zinc-600 dark:text-zinc-400 transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon />
        </motion.button>

        {/* Logo — mobile only (desktop uses sidebar) */}
        <Link to="/" className="lg:hidden flex-shrink-0">
          <Logo size="sm" />
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <span className={`absolute top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none
              ${isRTL ? 'right-3' : 'left-3'}`}>
              <SearchIcon />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              dir={isRTL ? 'rtl' : 'ltr'}
              className={`w-full ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2.5 rounded-xl
                bg-zinc-100 dark:bg-zinc-800/80
                text-zinc-900 dark:text-white text-sm
                placeholder:text-zinc-400
                border border-transparent
                focus:border-orange-500/50 focus:bg-white dark:focus:bg-zinc-800
                focus:outline-none transition-all duration-200`}
            />
          </div>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-1 ms-auto">
          {[
            { label: t('home'),     to: '/'        },
            { label: t('products'), to: '/products' },
            { label: t('contact'),  to: '/contact'  },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive(link.to)
                  ? 'text-orange-500 bg-orange-500/10 font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-orange-500 hover:bg-orange-500/10'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* WhatsApp CTA button */}
        <a
          href="https://wa.me/message/IXYMUJRDLYOXA1"
          target="_blank" rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 flex-shrink-0
            px-4 py-2.5 rounded-xl
            bg-orange-500 hover:bg-orange-600 text-white
            text-sm font-semibold transition-colors
            shadow-md shadow-orange-500/25"
        >
          <WAIcon />
          <span className="hidden md:inline">{t('contactUs')}</span>
        </a>
      </div>
    </header>
  )
}
