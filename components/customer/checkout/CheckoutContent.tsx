'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Cinzel, Cormorant_Garamond, Raleway } from 'next/font/google'
import {
  Check, CheckCircle2, Download, Info,
  Lock, Plus, RefreshCw, ShieldCheck, Truck, X,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import OrderSummaryCard from '@/components/customer/checkout/OrderSummaryCard'
import { useCartStore } from '@/store/cartStore'
import { useCheckoutStore } from '@/store/checkoutStore'
import { createClient } from '@/lib/supabase/client'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '600', '700'] })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400'] })
const raleway = Raleway({ subsets: ['latin'], weight: ['300', '400', '500', '600'] })

type CheckoutStepKey = 'delivery' | 'payment' | 'confirmation'

// ── Address form schema ───────────────────────────────
const addressSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  line1: z.string().min(5, 'Address is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postal_code: z.string().min(4, 'Postal code is required'),
  country: z.string().default('India'),
  tag: z.enum(['HOME', 'WORK', 'OTHER']).default('HOME'),
  is_default: z.boolean().default(false),
})

type AddressFormData = z.infer<typeof addressSchema>

// ── Delivery Step ─────────────────────────────────────
function DeliveryContent() {
  const router = useRouter()
  const supabase = createClient()
  const setSelectedAddress = useCheckoutStore((s) => s.setSelectedAddress)
  const [addresses, setAddresses] = useState<AddressFormData & { id: string }[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'India', tag: 'HOME', is_default: false },
  })

  // Load user + addresses
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser({ id: user.id, email: user.email ?? '' })

      const { data } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'shipping')
        .order('is_default', { ascending: false })

      if (data && data.length > 0) {
        setAddresses(data)
        const def = data.find((a) => a.is_default) ?? data[0]
        setSelectedId(def.id)
      } else {
        setShowForm(true)
      }
    }
    load()
  }, [])

  async function onSaveAddress(data: AddressFormData) {
    if (!user) return
    setSaving(true)

    const { data: saved, error } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        type: 'shipping',
        full_name: data.full_name,
        line1: data.line1,
        line2: data.line2 ?? null,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country,
        phone: data.phone,
        is_default: data.is_default,
      })
      .select()
      .single()

    setSaving(false)

    if (!error && saved) {
      setAddresses((prev) => [...prev, saved])
      setSelectedId(saved.id)
      setShowForm(false)
    }
  }

  function handleContinue() {
    const addr = addresses.find((a) => a.id === selectedId)
    if (!addr || !selectedId) return
    setSelectedAddress(selectedId, addr)
    router.push('/checkout/payment')
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="flex flex-col gap-6">

        {/* Step header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center bg-gold text-[11px] font-bold text-nav">1</div>
              <span className={`${cinzel.className} text-[11px] font-bold tracking-[0.4em] text-gold`}>DELIVERY ADDRESS</span>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex h-[38px] items-center gap-2 border border-gold/20 px-3 text-[9px] font-semibold tracking-[0.2em] text-gold"
            >
              <Plus className="h-3 w-3" />
              ADD NEW ADDRESS
            </button>
          </div>
          <p className={`${raleway.className} pl-10 text-[13px] text-text-muted`}>
            Where should we deliver your order?
          </p>
        </div>

        {/* Saved addresses */}
        {addresses.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            {addresses.map((addr) => (
              <button
                key={addr.id}
                type="button"
                onClick={() => setSelectedId(addr.id)}
                className={`flex flex-col gap-2.5 bg-surface p-5 text-left ${selectedId === addr.id
                  ? 'border border-gold border-l-[3px]'
                  : 'border border-gold/10'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] ${selectedId === addr.id ? 'text-gold' : 'text-text-muted'}`}>
                    {addr.tag}
                  </span>
                  <div className={`h-[18px] w-[18px] ${selectedId === addr.id ? 'bg-gold' : 'border border-gold/20'}`} />
                </div>
                <span className={`${raleway.className} text-[14px] font-medium text-text-primary`}>
                  {addr.full_name}
                </span>
                <span className={`${raleway.className} whitespace-pre-line text-[13px] leading-[2] text-text-muted`}>
                  {`${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}\n${addr.city}, ${addr.state} ${addr.postal_code}\n${addr.country}\n${addr.phone}`}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* New address form */}
        {showForm && (
          <form
            onSubmit={handleSubmit(onSaveAddress)}
            className="flex flex-col gap-4 border border-gold/10 bg-surface p-8"
          >
            <span className={`${cinzel.className} text-[10px] font-bold tracking-[0.3em] text-gold`}>
              NEW ADDRESS
            </span>

            {/* Tag */}
            <div className="space-y-2">
              <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>ADDRESS TAG</span>
              <div className="grid gap-3 sm:grid-cols-3">
                {(['HOME', 'WORK', 'OTHER'] as const).map((tag) => (
                  <label
                    key={tag}
                    className="flex h-[42px] cursor-pointer items-center justify-center border border-gold/15 px-3 text-[10px] font-semibold tracking-[0.2em] text-text-muted has-[:checked]:border-gold has-[:checked]:text-gold"
                  >
                    <input type="radio" value={tag} {...register('tag')} className="sr-only" />
                    {tag}
                  </label>
                ))}
              </div>
            </div>

            {/* Fields */}
            {[
              { label: 'FULL NAME', field: 'full_name' as const, placeholder: 'Arjun Sharma' },
              { label: 'PHONE NUMBER', field: 'phone' as const, placeholder: '+91 98765 43210' },
              { label: 'ADDRESS LINE 1', field: 'line1' as const, placeholder: '42, MG Road, Indiranagar' },
              { label: 'ADDRESS LINE 2 (OPTIONAL)', field: 'line2' as const, placeholder: 'Apartment, floor...' },
              { label: 'CITY', field: 'city' as const, placeholder: 'Bengaluru' },
              { label: 'STATE', field: 'state' as const, placeholder: 'Karnataka' },
              { label: 'POSTAL CODE', field: 'postal_code' as const, placeholder: '560038' },
              { label: 'COUNTRY', field: 'country' as const, placeholder: 'India' },
            ].map(({ label, field, placeholder }) => (
              <div key={field} className="space-y-2">
                <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>
                  {label}
                </span>
                <input
                  {...register(field)}
                  placeholder={placeholder}
                  className="flex h-[46px] w-full items-center border border-gold/15 bg-primary-deep px-4 font-sans text-[14px] text-text-primary outline-none focus:border-gold/40 placeholder:text-text-muted/50"
                />
                {errors[field] && (
                  <p className={`${raleway.className} flex items-center gap-1 text-[11px] text-[var(--status-error)]`}>
                    <Info className="h-[11px] w-[11px]" />
                    {errors[field]?.message}
                  </p>
                )}
              </div>
            ))}

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" {...register('is_default')} className="sr-only" />
              <div className="flex h-[18px] w-[18px] items-center justify-center border border-gold bg-gold/10">
                <Check className="h-[10px] w-[10px] text-gold" />
              </div>
              <span className={`${raleway.className} text-[13px] text-text-primary`}>
                Save as default shipping address
              </span>
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex h-[46px] items-center justify-center bg-gold px-6 text-[10px] font-semibold tracking-[0.2em] text-nav disabled:opacity-50"
              >
                {saving ? 'SAVING...' : 'SAVE ADDRESS'}
              </button>
              {addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex h-[46px] items-center justify-center border border-gold/20 px-6 text-[10px] font-semibold tracking-[0.2em] text-text-muted"
                >
                  CANCEL
                </button>
              )}
            </div>
          </form>
        )}

        {/* Shipping method */}
        <div className="space-y-4">
          <span className={`${cinzel.className} text-[10px] font-bold tracking-[0.4em] text-gold`}>SHIPPING METHOD</span>
          <div className="h-px w-full bg-gold/10" />
          <div className="flex items-center justify-between border border-gold border-l-[3px] bg-surface p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-[22px] w-[22px] items-center justify-center bg-gold/20">
                <Truck className="h-[12px] w-[12px] text-gold" />
              </div>
              <div className="space-y-1">
                <span className={`${cinzel.className} text-[12px] tracking-[0.15em] text-gold`}>Standard Shipping (5-7 days)</span>
                <span className={`${raleway.className} text-[12px] text-text-muted`}>Free on all orders</span>
              </div>
            </div>
            <span className={`${cinzel.className} text-[15px] text-[var(--status-success)]`}>Free</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleContinue}
              disabled={!selectedId}
              className="flex h-[52px] w-[300px] items-center justify-center bg-gold text-[10px] font-semibold tracking-[0.3em] text-nav disabled:opacity-40 disabled:cursor-not-allowed"
            >
              CONTINUE TO PAYMENT →
            </button>
            <div className="flex items-center gap-2 text-text-muted">
              <Lock className="h-[12px] w-[12px]" />
              <span className={`${raleway.className} text-[12px]`}>Your data is encrypted and secure</span>
            </div>
          </div>
        </div>
      </div>

      <OrderSummaryCard variant="delivery" />
    </div>
  )
}

// ── Payment Step ──────────────────────────────────────
function PaymentContent() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal())
  const clearCart = useCartStore((s) => s.clearCart)
  const shippingAddress = useCheckoutStore((s) => s.shippingAddress)
  const coupon = useCheckoutStore((s) => s.coupon)
  const setPaymentComplete = useCheckoutStore((s) => s.setPaymentComplete)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const discountAmount = coupon?.discount_amount ?? 0
  const total = subtotal - discountAmount

  async function handlePayWithRazorpay() {
    setLoading(true)
    setError('')

    try {
      // Get current user
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Please login to complete your purchase.')
        setLoading(false)
        return
      }

      const discountAmount = coupon?.discount_amount ?? 0
      const total = subtotal - discountAmount

      // Step 1 — Create Razorpay order
      const res = await fetch('/api/payments/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, currency: 'INR' }),
      })
      const { data, error: apiError } = await res.json()

      if (apiError || !data) {
        setError(apiError ?? 'Failed to create payment. Please try again.')
        setLoading(false)
        return
      }

      // Step 2 — Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Albaeon',
        description: 'Order Payment',
        order_id: data.id,
        handler: async function (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) {
          // Step 3 — Verify + create order in DB
          const verifyRes = await fetch('/api/webhooks/razorpay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items,
              shipping_address: shippingAddress,
              subtotal,
              discount_amount: discountAmount,
              coupon_id: coupon?.id ?? null,
              total,
              user_id: user.id,
            }),
          })

          const verifyData = await verifyRes.json()

          if (verifyData.data?.order_number) {
            setPaymentComplete(
              response.razorpay_payment_id,
              verifyData.data.order_id,
              verifyData.data.order_number
            )
            clearCart()
            router.push('/checkout/confirmation')
          } else {
            setError(verifyData.error ?? 'Payment verification failed. Contact support.')
          }
        },
        prefill: {
          name: shippingAddress?.full_name ?? '',
          contact: shippingAddress?.phone ?? '',
        },
        theme: { color: '#E6C979' },
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
      }

      // Load Razorpay script
      if (typeof window !== 'undefined') {
        if ((window as { Razorpay?: unknown }).Razorpay) {
          // Already loaded
          // @ts-expect-error Razorpay global
          const rzp = new window.Razorpay(options)
          rzp.open()
          setLoading(false)
        } else {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => {
            // @ts-expect-error Razorpay global
            const rzp = new window.Razorpay(options)
            rzp.open()
            setLoading(false)
          }
          script.onerror = () => {
            setError('Failed to load payment gateway. Check your internet connection.')
            setLoading(false)
          }
          document.body.appendChild(script)
        }
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="flex flex-col gap-6">

        {/* Delivery summary bar */}
        {shippingAddress && (
          <div className="flex items-center justify-between border border-gold/10 bg-surface px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-[22px] w-[22px] items-center justify-center border border-[var(--status-success)] bg-[#4CAF7D1A]">
                <Check className="h-[12px] w-[12px] text-[var(--status-success)]" />
              </div>
              <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-[var(--status-success)]`}>DELIVERING TO</span>
              <span className={`${raleway.className} text-[13px] text-text-muted`}>
                {shippingAddress.line1}, {shippingAddress.city} {shippingAddress.postal_code} · Standard Shipping · Free
              </span>
            </div>
            <Link href="/checkout/delivery" className={`${cinzel.className} text-[9px] font-semibold tracking-[0.2em] text-gold`}>
              EDIT
            </Link>
          </div>
        )}

        {/* Payment method */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center bg-gold text-[11px] font-bold text-nav">2</div>
            <span className={`${cinzel.className} text-[11px] font-bold tracking-[0.4em] text-gold`}>PAYMENT</span>
          </div>
          <p className={`${raleway.className} pl-10 text-[13px] text-text-muted`}>Choose your payment method</p>
        </div>

        <div className="flex flex-col gap-4 border border-gold border-l-[3px] bg-surface p-7">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <Lock className="mt-1 h-5 w-5 text-gold" />
              <div className="space-y-1">
                <span className={`${cinzel.className} text-[11px] font-bold tracking-[0.2em] text-gold`}>SECURE PAYMENT</span>
                <span className={`${raleway.className} text-[13px] text-text-muted`}>Powered by Razorpay · ₹ INR</span>
              </div>
            </div>
            <div className="flex h-7 w-[100px] items-center justify-center border border-gold/30 text-[11px] text-text-muted">Razorpay</div>
          </div>

          <div className="flex flex-wrap gap-2">
            {['UPI', 'Net Banking', 'Visa', 'Mastercard', 'RuPay', 'Wallets', 'EMI'].map((method) => (
              <div key={method} className="border border-gold/10 bg-primary-deep px-3 py-1 text-[11px] text-text-muted">{method}</div>
            ))}
          </div>

          <div className="flex gap-3 border-l-2 border-[var(--status-info)] bg-[#4A90C410] px-4 py-3">
            <Info className="mt-0.5 h-[14px] w-[14px] text-[var(--status-info)]" />
            <p className={`${raleway.className} text-[13px] leading-[1.7] text-text-muted`}>
              You will be redirected to Razorpay's secure payment page to complete your purchase.
            </p>
          </div>
        </div>

        {/* Order review */}
        <div className="space-y-3">
          <span className={`${cinzel.className} text-[10px] font-bold tracking-[0.4em] text-gold`}>REVIEW YOUR ORDER</span>
          <div className="h-px w-full bg-gold/10" />
          {items.map((item) => (
            <div key={item.variantId} className="flex items-center gap-4 border-b border-gold/10 py-3">
              <div className="relative h-14 w-14 border border-gold/10 bg-primary-deep overflow-hidden flex-shrink-0">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <span className={`${cinzel.className} text-[12px] font-semibold text-text-primary`}>
                  {item.name.toUpperCase()}
                </span>
                <span className={`${raleway.className} text-[12px] text-text-muted`}>
                  {item.color ? `${item.color} · ` : ''}{item.size} · Qty {item.quantity}
                </span>
              </div>
              <span className={`${cinzel.className} text-[15px] text-gold`}>
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex gap-3 border-l-2 border-[var(--status-error)] bg-[#C0392B14] px-5 py-4">
            <X className="h-[18px] w-[18px] text-[var(--status-error)]" />
            <div className="space-y-1">
              <span className={`${cinzel.className} text-[11px] font-bold tracking-[0.2em] text-[var(--status-error)]`}>PAYMENT FAILED</span>
              <p className={`${raleway.className} text-[13px] text-text-primary`}>{error}</p>
            </div>
          </div>
        )}

        {/* Pay button */}
        <button
          type="button"
          onClick={handlePayWithRazorpay}
          disabled={loading || items.length === 0}
          className="flex h-[58px] items-center justify-center bg-gold text-[12px] font-semibold tracking-[0.3em] text-nav disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-hover transition-colors"
        >
          {loading ? 'PREPARING PAYMENT...' : `Pay ₹${total.toLocaleString('en-IN')} Securely via Razorpay →`}
        </button>

        <div className="flex flex-wrap justify-center gap-7 text-text-muted">
          {[
            { icon: Lock, label: 'Encrypted & Secure' },
            { icon: ShieldCheck, label: 'No card data stored by Albaeon' },
            { icon: RefreshCw, label: 'Payments secured by Razorpay' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <item.icon className="h-[14px] w-[14px]" />
              <span className={`${raleway.className} text-[12px]`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <OrderSummaryCard variant="payment" />
    </div>
  )
}

// ── Confirmation Step ─────────────────────────────────
function ConfirmationContent() {
  const orderNumber = useCheckoutStore((s) => s.orderNumber)
  const paymentId = useCheckoutStore((s) => s.paymentId)
  const shippingAddress = useCheckoutStore((s) => s.shippingAddress)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser({ email: data.user.email ?? '' })
    })
  }, [])

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="flex flex-col gap-6">

        {/* Success banner */}
        <div className="flex flex-col items-center gap-3 border border-gold/20 bg-surface px-10 py-12 text-center">
          <div className="flex h-24 w-24 items-center justify-center border-2 border-[var(--status-success)] bg-[#4CAF7D1A]">
            <Check className="h-10 w-10 text-[var(--status-success)]" />
          </div>
          <span className={`${cinzel.className} text-[10px] font-bold tracking-[0.5em] text-[var(--status-success)]`}>
            PAYMENT SUCCESSFUL
          </span>
          <span className={`${cormorant.className} text-[38px] font-light text-text-primary sm:text-[48px]`}>
            Order Confirmed
          </span>
          <span className={`${cinzel.className} text-[18px] font-semibold text-gold`}>
            {orderNumber ?? 'ALB-00000'}
          </span>
          <div className="h-px w-[60px] bg-gold" />
          <span className={`${cormorant.className} text-[22px] font-light text-text-primary`}>
            Thank you{shippingAddress ? `, ${shippingAddress.full_name.split(' ')[0]}` : ''}.
          </span>
          {user?.email && (
            <p className={`${raleway.className} max-w-[500px] text-[14px] text-text-muted`}>
              Your order has been placed and a confirmation email has been sent to {user.email}
            </p>
          )}
        </div>

        {/* Delivery + payment details */}
        <div className="grid gap-4 lg:grid-cols-2">
          {shippingAddress && (
            <div className="flex flex-col gap-3 border border-gold/10 bg-primary-deep p-5">
              <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>DELIVERING TO</span>
              <span className={`${raleway.className} whitespace-pre-line text-[14px] text-text-primary`}>
                {`${shippingAddress.full_name}\n${shippingAddress.line1}${shippingAddress.line2 ? ', ' + shippingAddress.line2 : ''}\n${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postal_code}\n${shippingAddress.country}`}
              </span>
              <div className="h-px w-full bg-gold/10" />
              <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>ESTIMATED DELIVERY</span>
              <span className={`${raleway.className} text-[14px] text-text-primary`}>5-7 Business Days</span>
              <span className={`${raleway.className} text-[12px] text-[var(--status-success)]`}>Standard Shipping · Free</span>
            </div>
          )}

          <div className="flex flex-col gap-3 border border-gold/10 bg-primary-deep p-5">
            <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>PAYMENT DETAILS</span>
            <div className="flex items-center justify-between text-[13px] text-text-muted">
              <span>Transaction ID</span>
              <span className="text-text-primary text-[11px]">{paymentId ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between text-[13px] text-text-muted">
              <span>Status</span>
              <span className="border border-[var(--status-success)] bg-[#4CAF7D1A] px-2 py-0.5 text-[9px] text-[var(--status-success)]">
                PAID
              </span>
            </div>
            <div className="flex items-center justify-between text-[13px] text-text-muted">
              <span>Method</span>
              <span className="text-text-primary">Razorpay</span>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="flex flex-col gap-4">
          <span className={`${cinzel.className} text-[10px] font-bold tracking-[0.4em] text-gold`}>WHAT HAPPENS NEXT</span>
          <div className="h-px w-full bg-gold/10" />
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              { step: '01', title: 'ORDER PROCESSING', body: 'Your order is being prepared and sent to our fulfilment partner.' },
              { step: '02', title: 'ORDER SHIPPED', body: 'You will receive a shipping confirmation email with your tracking number.' },
              { step: '03', title: 'DELIVERED', body: 'Estimated 5-7 business days from order confirmation.' },
            ].map((item, index) => (
              <div key={item.step} className={`flex flex-col gap-2 ${index < 2 ? 'lg:border-r lg:border-gold/10 lg:pr-6' : ''}`}>
                <span className={`${cormorant.className} text-[32px] text-gold`}>{item.step}</span>
                <span className={`${cinzel.className} text-[11px] font-semibold tracking-[0.2em] text-text-primary`}>{item.title}</span>
                <span className={`${raleway.className} text-[13px] text-text-muted`}>{item.body}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/track-order" className="flex h-[50px] w-[220px] items-center justify-center border border-gold text-[10px] font-semibold tracking-[0.3em] text-gold">
            TRACK MY ORDER
          </Link>
          <button className="flex h-[50px] w-[220px] items-center justify-center border border-gold/20 text-[10px] font-semibold tracking-[0.3em] text-text-muted">
            <Download className="mr-2 h-[14px] w-[14px]" />
            DOWNLOAD INVOICE
          </button>
          <Link href="/shop" className="flex h-[50px] w-[220px] items-center justify-center bg-gold text-[10px] font-semibold tracking-[0.3em] text-nav">
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>

      {/* Confirmation sidebar */}
      <div className="flex flex-col gap-4 border border-gold/20 bg-[#1E1A2E] p-7">
        <div className="flex items-center gap-2 border-b border-gold/10 pb-4 text-[var(--status-success)]">
          <CheckCircle2 className="h-[22px] w-[22px]" />
          <span className={`${cinzel.className} text-[11px] font-bold tracking-[0.3em]`}>ORDER CONFIRMED</span>
        </div>
        <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>ORDER NUMBER</span>
        <span className={`${cinzel.className} text-[20px] text-gold`}>{orderNumber ?? '—'}</span>
        <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>PLACED ON</span>
        <span className={`${raleway.className} text-[14px] text-text-primary`}>
          {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
        <div className="h-px w-full bg-gold/10" />
        {user?.email && (
          <>
            <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>CONFIRMATION SENT TO</span>
            <span className={`${raleway.className} text-[13px] text-text-primary`}>{user.email}</span>
          </>
        )}
        <div className="h-px w-full bg-gold/10" />
        <span className={`${cinzel.className} text-[9px] font-bold tracking-[0.3em] text-text-muted`}>NEED HELP?</span>
        <Link href="/contact" className={`${cinzel.className} text-[9px] font-semibold tracking-[0.2em] text-gold`}>CONTACT SUPPORT →</Link>
        <Link href="/track-order" className={`${cinzel.className} text-[9px] font-semibold tracking-[0.2em] text-text-muted`}>TRACK MY ORDER →</Link>
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────
export default function CheckoutContent({ step }: { step: CheckoutStepKey }) {
  if (step === 'payment') return <PaymentContent />
  if (step === 'confirmation') return <ConfirmationContent />
  return <DeliveryContent />
}