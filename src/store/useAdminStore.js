/**
 * src/store/useAdminStore.js
 *
 * Handles ONLY authentication.
 * Product storage is now handled by Firebase (productsService.js)
 * and read via useFirebaseProducts store.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { products as staticProducts } from '../assets/products'

const ADMIN_USER = 'cityvape'
const ADMIN_PASS = 'cityvape1234567890'

export const useAdminStore = create(
  persist(
    (set, get) => ({

      /* ── auth ── */
      isAuthenticated: false,

      login(username, password) {
        if (username === ADMIN_USER && password === ADMIN_PASS) {
          set({ isAuthenticated: true })
          return { ok: true }
        }
        return { ok: false, error: 'Invalid username or password' }
      },

      logout() {
        set({ isAuthenticated: false })
      },

      /* ── stats helper (uses static + firebase products) ── */
      getStats(firebaseProducts = []) {
        const all = [...staticProducts, ...firebaseProducts]
        return {
          total:       all.length,
          firebaseAdded: firebaseProducts.length,
          byCategory:  all.reduce((acc, p) => {
            acc[p.category] = (acc[p.category] || 0) + 1
            return acc
          }, {}),
        }
      },
    }),
    {
      name: 'city-vape-admin-v2',
      partialize: s => ({ isAuthenticated: s.isAuthenticated }),
    }
  )
)
