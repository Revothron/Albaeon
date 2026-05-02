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

export type CheckoutCoupon = {
  id: string
  code: string
  type: 'percentage' | 'flat'
  value: number
  discount_amount: number
}

type CheckoutState = {
  selectedAddressId: string | null
  shippingAddress: CheckoutAddress | null
  coupon: CheckoutCoupon | null
  razorpayOrderId: string | null
  paymentId: string | null
  orderId: string | null
  orderNumber: string | null
  setSelectedAddress: (id: string, address: CheckoutAddress) => void
  setCoupon: (coupon: CheckoutCoupon | null) => void
  setRazorpayOrderId: (id: string) => void
  setPaymentComplete: (paymentId: string, orderId: string, orderNumber: string) => void
  reset: () => void
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      selectedAddressId: null,
      shippingAddress: null,
      coupon: null,
      razorpayOrderId: null,
      paymentId: null,
      orderId: null,
      orderNumber: null,
      setSelectedAddress: (id, address) =>
        set({ selectedAddressId: id, shippingAddress: address }),
      setCoupon: (coupon) =>
        set({ coupon }),
      setRazorpayOrderId: (id) =>
        set({ razorpayOrderId: id }),
      setPaymentComplete: (paymentId, orderId, orderNumber) =>
        set({ paymentId, orderId, orderNumber }),
      reset: () =>
        set({
          selectedAddressId: null,
          shippingAddress: null,
          coupon: null,
          razorpayOrderId: null,
          paymentId: null,
          orderId: null,
          orderNumber: null,
        }),
    }),
    { name: 'albaeon-checkout' }
  )
)