'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ViewedProduct = {
  id: string
  slug: string
  name: string
  image: string
  price_inr: number
  viewedAt: number
}

type SearchTerm = {
  term: string
  searchedAt: number
}

interface TrackingState {
  viewedProducts: ViewedProduct[]
  searchHistory: SearchTerm[]
  trackView: (product: ViewedProduct) => void
  trackSearch: (term: string) => void
  clearHistory: () => void
}

export const useTrackingStore = create<TrackingState>()(
  persist(
    (set, get) => ({
      viewedProducts: [],
      searchHistory: [],

      trackView: (product) => {
        set((state) => {
          // Remove if already exists, add to front
          const filtered = state.viewedProducts.filter(
            (p) => p.id !== product.id
          )
          return {
            viewedProducts: [
              { ...product, viewedAt: Date.now() },
              ...filtered,
            ].slice(0, 20), // keep last 20
          }
        })
      },

      trackSearch: (term) => {
        if (term.trim().length < 2) return
        set((state) => {
          const filtered = state.searchHistory.filter(
            (s) => s.term.toLowerCase() !== term.toLowerCase()
          )
          return {
            searchHistory: [
              { term: term.trim(), searchedAt: Date.now() },
              ...filtered,
            ].slice(0, 10), // keep last 10
          }
        })
      },

      clearHistory: () =>
        set({ viewedProducts: [], searchHistory: [] }),
    }),
    { name: 'albaeon-tracking' }
  )
)