import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ShippingAddress = {
  full_name: string
  email: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  postal_code: string
  country: string
}

type CheckoutState = {
  address: ShippingAddress | null
  couponCode: string
  couponDiscount: number
  couponId: string | null
  orderNumber: string | null
  paymentId: string | null
  setAddress: (address: ShippingAddress) => void
  setSelectedAddress: (id: string, address: ShippingAddress) => void
  setCoupon: (code: string, discount: number, id: string | null) => void
  orderId: string | null
  setOrderResult: (paymentId: string, orderId: string, orderNumber: string) => void
  clearCoupon: () => void
  clearCheckout: () => void
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      address: null,
      couponCode: '',
      couponDiscount: 0,
      couponId: null,
      orderNumber: null,
      paymentId: null,
      orderId: null,
      setAddress: (address) => set({ address }),
      setSelectedAddress: (id, address) => set({ address }),
      setCoupon: (code, discount, id) =>
        set({ couponCode: code, couponDiscount: discount, couponId: id }),
      setOrderResult: (paymentId, orderId, orderNumber) =>
        set({ paymentId, orderId, orderNumber }),
      clearCoupon: () =>
        set({ couponCode: '', couponDiscount: 0, couponId: null }),
      clearCheckout: () =>
        set({
          address: null,
          couponCode: '',
          couponDiscount: 0,
          couponId: null,
          orderNumber: null,
          paymentId: null,
          orderId: null,
        }),
    }),
    { name: 'albaeon-checkout' }
  )
)