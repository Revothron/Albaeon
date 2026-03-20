'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  name: string;
  sku: string;
  color: string;
  size: string;
  price: number;
  currency: 'INR' | 'USD';
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.variantId === item.variantId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => i.variantId !== variantId
          ),
        }));
      },

      updateQuantity: (variantId, qty) => {
        if (qty < 1) return;
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: qty }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        ),
    }),
    {
      name: 'albaeon-cart',
    }
  )
);
