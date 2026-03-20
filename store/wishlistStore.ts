'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggle: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        set((state) => {
          if (state.items.includes(productId)) return state;
          return { items: [...state.items, productId] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }));
      },

      toggle: (productId) => {
        if (get().items.includes(productId)) {
          get().removeItem(productId);
        } else {
          get().addItem(productId);
        }
      },

      isInWishlist: (productId) =>
        get().items.includes(productId),

      totalItems: () => get().items.length,
    }),
    {
      name: 'albaeon-wishlist',
    }
  )
);
