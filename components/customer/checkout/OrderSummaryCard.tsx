'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Cinzel, Raleway } from 'next/font/google'
import { Lock, RefreshCw, ShieldCheck, Truck } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useCheckoutStore } from '@/store/checkoutStore'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '600', '700'] })
const raleway = Raleway({ subsets: ['latin'], weight: ['300', '400', '500', '600'] })

type OrderSummaryVariant = 'delivery' | 'payment'

export default function OrderSummaryCard({ variant }: { variant: OrderSummaryVariant }) {
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal())
  const setCoupon = useCheckoutStore((s) => s.setCoupon)
  const savedCoupon = useCheckoutStore((s) => s.coupon)

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const [couponCode, setCouponCode] = useState(savedCoupon?.code ?? '')
  const [couponApplied, setCouponApplied] = useState(!!savedCoupon)
  const [couponDiscount, setCouponDiscount] = useState(savedCoupon?.discount_amount ?? 0)
  const [couponLabel, setCouponLabel] = useState(
    savedCoupon ? `${savedCoupon.code} — ₹${savedCoupon.discount_amount} off` : ''
  )
  const [couponError, setCouponError] = useState('')
  const [applying, setApplying] = useState(false)

  const displaySubtotal = mounted ? subtotal : 0
  const displayItems = mounted ? items : []
  const total = displaySubtotal - couponDiscount

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return
    setApplying(true)
    setCouponError('')

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      })
      const json = await res.json()

      if (!res.ok || json.error) {
        setCouponError(json.error ?? 'Invalid coupon code')
        setCouponApplied(false)
        setCoupon(null)
      } else {
        setCouponApplied(true)
        setCouponDiscount(json.data.discount_amount)
        setCouponLabel(`${json.data.code} — ₹${json.data.discount_amount} off`)
        setCouponError('')
        // ── Save to checkout store ─────────────────
        setCoupon({
          id: json.data.id,
          code: json.data.code,
          type: json.data.type,
          value: json.data.value,
          discount_amount: json.data.discount_amount,
        })
      }
    } catch {
      setCouponError('Failed to validate coupon')
    } finally {
      setApplying(false)
    }
  }

  function handleRemoveCoupon() {
    setCouponApplied(false)
    setCouponDiscount(0)
    setCouponLabel('')
    setCouponCode('')
    setCouponError('')
    setCoupon(null)
  }

  return (
    <div className="flex flex-col gap-4 border border-gold/20 bg-[#1E1A2E] p-7 text-[13px] text-text-muted">
      <div className="flex items-center justify-between">
        <span className={`${cinzel.className} text-[10px] font-bold tracking-[0.4em] text-gold`}>
          ORDER SUMMARY
        </span>
        <span className={`${cinzel.className} text-[9px] font-semibold tracking-[0.2em] text-text-muted`}>
          {items.length} ITEM{items.length !== 1 ? 'S' : ''}
        </span>
      </div>

      <div className="h-px w-full bg-gold/10" />

      {/* ── Items ─────────────────────────── */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.variantId} className="flex items-start gap-3">
            <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center border border-gold/10 bg-primary-deep overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : null}
              <div className="absolute -top-1 -right-1 flex h-[18px] w-[18px] items-center justify-center bg-gold text-[10px] font-bold text-nav">
                {item.quantity}
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <span className={`${cinzel.className} text-[11px] font-semibold tracking-[0.08em] text-text-primary`}>
                {item.name.toUpperCase()}
              </span>
              <span className={`${raleway.className} text-[11px] text-text-muted`}>
                {item.color ? `${item.color} · ` : ''}{item.size} · Qty {item.quantity}
              </span>
              <span className={`${cinzel.className} text-[14px] text-gold`}>
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="h-px w-full bg-gold/10" />

      {/* ── Coupon ────────────────────────── */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Coupon code"
          disabled={couponApplied}
          className="flex h-11 flex-1 items-center border border-gold/15 bg-nav px-3 text-[13px] text-text-primary outline-none placeholder:text-text-muted disabled:opacity-50"
        />
        <button
          type="button"
          onClick={couponApplied ? handleRemoveCoupon : handleApplyCoupon}
          disabled={applying}
          className="flex h-11 w-20 items-center justify-center border border-gold/30 hover:border-gold transition-colors disabled:opacity-50"
        >
          <span className={`${cinzel.className} text-[10px] font-semibold tracking-[0.2em] text-text-muted`}>
            {applying ? '...' : couponApplied ? 'REMOVE' : 'APPLY'}
          </span>
        </button>
      </div>

      {couponError && (
        <p className={`${raleway.className} text-[11px] text-[var(--status-error)]`}>
          {couponError}
        </p>
      )}

      {couponApplied && (
        <div className="flex items-center justify-between border-l-2 border-[var(--status-success)] bg-[#4CAF7D1A] px-3 py-2">
          <span className={`${raleway.className} text-[12px] text-[var(--status-success)]`}>
            {couponLabel}
          </span>
        </div>
      )}

      <div className="h-px w-full bg-gold/10" />

      {/* ── Totals ────────────────────────── */}
      <div className="flex items-center justify-between">
        <span className={`${raleway.className} text-[13px] text-text-muted`}>
          Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})
        </span>
        <span className={`${raleway.className} text-[13px] text-text-primary`}>
          ₹{subtotal.toLocaleString('en-IN')}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className={`${raleway.className} text-[13px] text-text-muted`}>Shipping</span>
        <span className={`${raleway.className} text-[13px] text-[var(--status-success)]`}>Free</span>
      </div>
      {couponApplied && couponDiscount > 0 && (
        <div className="flex items-center justify-between">
          <span className={`${raleway.className} text-[13px] text-text-muted`}>Discount</span>
          <span className={`${raleway.className} text-[13px] text-[var(--status-success)]`}>
            −₹{couponDiscount.toLocaleString('en-IN')}
          </span>
        </div>
      )}

      <div className="h-px w-full bg-gold/20" />

      <div className="flex items-center justify-between">
        <span className={`${cinzel.className} text-[12px] font-bold tracking-[0.2em] text-gold`}>TOTAL</span>
        <span className={`${cinzel.className} text-[26px] text-gold`}>
          ₹{total.toLocaleString('en-IN')}
        </span>
      </div>
      <div className="flex justify-end">
        <span className={`${raleway.className} text-[10px] text-text-muted`}>Inclusive of all taxes</span>
      </div>

      <div className="h-px w-full bg-gold/10" />

      {variant === 'payment' && (
        <div className="flex items-center justify-center gap-2">
          <span className={`${raleway.className} text-[11px] text-text-muted`}>Secured by</span>
          <div className="flex h-[18px] w-[70px] items-center justify-center border border-gold/20 text-[10px] text-text-muted">
            Razorpay
          </div>
          <Lock className="h-[11px] w-[11px] text-text-muted" />
        </div>
      )}

      <div className="flex items-center gap-2 border-b border-gold/10 py-2">
        <ShieldCheck className="h-[12px] w-[12px] text-[var(--status-success)]" />
        <span className={`${raleway.className} text-[12px] text-text-muted`}>SSL Encrypted — 256-bit security</span>
      </div>
      <div className="flex items-center gap-2 border-b border-gold/10 py-2">
        <RefreshCw className="h-[12px] w-[12px] text-text-muted" />
        <span className={`${raleway.className} text-[12px] text-text-muted`}>No returns — report damaged items</span>
      </div>
      <div className="flex items-center gap-2 border-b border-gold/10 py-2">
        <Truck className="h-[12px] w-[12px] text-text-muted" />
        <span className={`${raleway.className} text-[12px] text-text-muted`}>Free shipping on all orders</span>
      </div>

      <div className="h-px w-full bg-gold/10" />
      <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>NEED HELP?</span>
      <span className={`${cinzel.className} text-[9px] font-semibold tracking-[0.2em] text-gold`}>CONTACT SUPPORT →</span>
      <span className={`${cinzel.className} text-[9px] font-semibold tracking-[0.2em] text-text-muted`}>SHIPPING POLICY →</span>
    </div>
  )
}