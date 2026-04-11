'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'

// ── Helper: sync items to cookie for SSR access ───────
function syncCookie(items: string[]) {
  if (typeof document === 'undefined') return
  document.cookie = `albaeon-wishlist=${JSON.stringify(items)};path=/;max-age=${60 * 60 * 24 * 30}`
}

interface WishlistState {
  items: string[]
  synced: boolean
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  toggle: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  totalItems: () => number
  syncWithSupabase: () => Promise<void>
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      synced: false,

      addItem: (productId) => {
        set((state) => {
          if (state.items.includes(productId)) return state
          const items = [...state.items, productId]
          syncCookie(items)
          return { items }
        })

        const supabase = createClient()
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (!user) return
          supabase
            .from('wishlists')
            .insert({ user_id: user.id, product_id: productId })
            .then(() => {})
        })
      },

      removeItem: (productId) => {
        set((state) => {
          const items = state.items.filter((id) => id !== productId)
          syncCookie(items)
          return { items }
        })

        const supabase = createClient()
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (!user) return
          supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId)
            .then(() => {})
        })
      },

      toggle: (productId) => {
        const isIn = get().items.includes(productId)
        if (isIn) {
          get().removeItem(productId)
        } else {
          get().addItem(productId)
        }
      },

      isInWishlist: (productId) => get().items.includes(productId),

      totalItems: () => get().items.length,

      syncWithSupabase: async () => {
        if (get().synced) return

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from('wishlists')
          .select('product_id')
          .eq('user_id', user.id)

        if (!data) return

        const supabaseIds = data.map((w) => w.product_id)
        const localIds = get().items
        const merged = [...new Set([...supabaseIds, ...localIds])]

        const localOnly = localIds.filter((id) => !supabaseIds.includes(id))
        if (localOnly.length > 0) {
          await supabase.from('wishlists').insert(
            localOnly.map((product_id) => ({ user_id: user.id, product_id }))
          )
        }

        syncCookie(merged)
        set({ items: merged, synced: true })
      },
    }),
    { name: 'albaeon-wishlist' }
  )
)