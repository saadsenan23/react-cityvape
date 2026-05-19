import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      /* ── theme ── */
      isDark: false,
      toggleTheme() {
        const next = !get().isDark
        set({ isDark: next })
        document.documentElement.classList.toggle('dark', next)
      },
      initTheme() {
        document.documentElement.classList.toggle('dark', get().isDark)
      },

      /* ── language ── */
      language: 'en',
      setLanguage(lang) {
        set({ language: lang })
        document.documentElement.setAttribute('lang', lang)
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
        document.body.classList.toggle('rtl', lang === 'ar')
      },

      /* ── sidebar ── */
      sidebarOpen: false,
      setSidebarOpen: (val) => set({ sidebarOpen: val }),
      toggleSidebar: ()    => set(s => ({ sidebarOpen: !s.sidebarOpen })),

      /* ── age gate ── */
      ageVerified: false,
      setAgeVerified: (val) => set({ ageVerified: val }),

      /* ── search / filter ── */
      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),
      activeCategory: 'all',
      setActiveCategory: (cat) => set({ activeCategory: cat }),

      /* ── product modal ── */
      selectedProduct: null,
      setSelectedProduct: (p) => set({ selectedProduct: p }),
    }),
    {
      name: 'city-vape-v2',
      partialize: s => ({
        isDark:       s.isDark,
        language:     s.language,
        ageVerified:  s.ageVerified,
      }),
    }
  )
)
