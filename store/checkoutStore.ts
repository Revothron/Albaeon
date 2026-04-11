'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CheckoutAddress = {
  full_name: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  postal_code: string
  country: string
  tag: 'HOME' | 'WORK' | 'OTHER'
  is_default: boolean
}

type CheckoutState = {
  selectedAddressId: string | null
  shippingAddress: CheckoutAddress | null
  razorpayOrderId: string | null
  paymentId: string | null
  orderId: string | null
  orderNumber: string | null

  setSelectedAddress: (id: string, address: CheckoutAddress) => void
  setRazorpayOrderId: (id: string) => void
  setPaymentComplete: (paymentId: string, orderId: string, orderNumber: string) => void
  reset: () => void
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      selectedAddressId: null,
      shippingAddress: null,
      razorpayOrderId: null,
      paymentId: null,
      orderId: null,
      orderNumber: null,

      setSelectedAddress: (id, address) =>
        set({ selectedAddressId: id, shippingAddress: address }),

      setRazorpayOrderId: (id) =>
        set({ razorpayOrderId: id }),

      setPaymentComplete: (paymentId, orderId, orderNumber) =>
        set({ paymentId, orderId, orderNumber }),

      reset: () =>
        set({
          selectedAddressId: null,
          shippingAddress: null,
          razorpayOrderId: null,
          paymentId: null,
          orderId: null,
          orderNumber: null,
        }),
    }),
    { name: 'albaeon-checkout' }
  )
)