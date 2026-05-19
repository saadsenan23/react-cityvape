/**
 * src/store/useFirebaseProducts.js
 *
 * Zustand store that syncs Firestore products in real-time.
 *
 * Uses the canonical service: src/services/productsService.js
 *
 * Usage (in any component):
 *   const { firebaseProducts, loading, error } = useFirebaseProducts()
 *
 * Subscription is started once in App.jsx:
 *   const { subscribe, unsubscribe } = useFirebaseProducts()
 *   useEffect(() => { subscribe(); return unsubscribe }, [])
 */

import { create } from 'zustand'
import { subscribeProducts } from '../services/productsService'

export const useFirebaseProducts = create((set, get) => ({
  firebaseProducts: [],
  loading:          true,
  error:            null,
  _unsubscribe:     null,

  /* ── Start Firestore real-time listener ── */
  subscribe() {
    // Prevent double-subscription (safe for React StrictMode + HMR)
    if (get()._unsubscribe) return

    const unsub = subscribeProducts(
      (products) => set({ firebaseProducts: products, loading: false, error: null }),
    )

    set({ _unsubscribe: unsub })
  },

  /* ── Stop listener ── */
  unsubscribe() {
    get()._unsubscribe?.()
    set({ _unsubscribe: null, loading: true })
  },
}))
