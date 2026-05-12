'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Cinzel } from 'next/font/google'
import Script from 'next/script'
import { useCartStore } from '@/store/cartStore'
import { useCheckoutStore } from '@/store/checkoutStore'
import { createClient } from '@/lib/supabase/client'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '600', '700'] })

declare global {
    interface Window {
        Razorpay: new (options: Record<string, unknown>) => {
            open: () => void
        }
    }
}

export default function PaymentContent() {
    const router = useRouter()
    const items = useCartStore((s) => s.items)
    const clearCart = useCartStore((s) => s.clearCart)
    const subtotal = useCartStore((s) => s.subtotal())

    const {
        address,
        couponCode, setCoupon, clearCoupon,
        couponDiscount, couponId,
        setOrderResult, clearCheckout,
    } = useCheckoutStore()

    const [couponInput, setCouponInput] = useState(couponCode)
    const [couponLoading, setCouponLoading] = useState(false)
    const [couponError, setCouponError] = useState('')
    const [paying, setPaying] = useState(false)
    const [scriptLoaded, setScriptLoaded] = useState(false)

    const currency = items[0]?.currency ?? 'INR'
    const formatPrice = (n: number) =>
        currency === 'INR' ? `₹${n.toLocaleString('en-IN')}` : `$${n.toFixed(2)}`

    const total = Math.max(0, subtotal - couponDiscount)

    // Redirect if no address or empty cart
    useEffect(() => {
        if (!address) router.replace('/checkout/delivery')
        if (items.length === 0) router.replace('/cart')
    }, [address, items.length])

    async function handleApplyCoupon() {
        if (!couponInput.trim()) return
        setCouponLoading(true)
        setCouponError('')
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponInput.trim(), subtotal }),
            })
            const data = await res.json()
            if (data.error) {
                setCouponError(data.error)
                clearCoupon()
            } else {
                setCoupon(couponInput.trim().toUpperCase(), data.discount, data.coupon_id)
                setCouponError('')
            }
        } catch {
            setCouponError('Failed to validate coupon')
        } finally {
            setCouponLoading(false)
        }
    }

    function handleRemoveCoupon() {
        setCouponInput('')
        clearCoupon()
        setCouponError('')
    }

    async function handlePay() {
        if (!address || items.length === 0) return
        setPaying(true)

        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            // 1 — Create Razorpay order
            const orderRes = await fetch('/api/payments/razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: total,
                    currency,
                }),
            })
            const orderData = await orderRes.json()
            if (orderData.error || !orderData.data?.id) {
                alert(orderData.error ?? 'Failed to create payment order')
                setPaying(false)
                return
            }

            const razorpayOrder = orderData.data

            // 2 — Open Razorpay modal
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                order_id: razorpayOrder.id,
                name: 'Albaeon',
                description: `Order for ${items.length} item${items.length > 1 ? 's' : ''}`,
                prefill: {
                    name: address.full_name,
                    email: address.email,
                    contact: address.phone,
                },
                theme: { color: '#E6C979' },

                handler: async (response: {
                    razorpay_payment_id: string
                    razorpay_order_id: string
                    razorpay_signature: string
                }) => {
                    // 3 — Verify payment + create order
                    const webhookRes = await fetch('/api/webhooks/razorpay', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            user_id: user?.id ?? null,
                            items: items.map((item) => ({
                                productId: item.productId,
                                variantId: item.variantId,
                                name: item.name,
                                sku: item.sku,
                                color: item.color,
                                size: item.size,
                                quantity: item.quantity,
                                price: item.price,
                            })),
                            shipping_address: address,
                            subtotal,
                            discount_amount: couponDiscount,
                            coupon_id: couponId,
                            total,
                            currency,
                        }),
                    })

                    const webhookData = await webhookRes.json()

                    if (webhookData.error || !webhookData.data?.order_number) {
                        alert('Payment received but order creation failed. Contact support with payment ID: ' + response.razorpay_payment_id)
                        setPaying(false)
                        return
                    }

                    // 4 — Save order result + clear cart
                    const { order_number, order_id } = webhookData.data
                    setOrderResult(order_number, order_id)
                    clearCart()

                    // 5 — Redirect to confirmation
                    router.push(`/checkout/confirmation?order=${order_number}`)
                },

                modal: {
                    ondismiss: () => {
                        setPaying(false)
                    },
                },
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (err) {
            console.error('Payment error:', err)
            alert('Something went wrong. Please try again.')
            setPaying(false)
        }
    }

    if (!address || items.length === 0) return null

    return (
        <>
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="lazyOnload"
                onLoad={() => setScriptLoaded(true)}
            />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                {/* ── Left ───────────────────────────────── */}
                <div className="space-y-5">

                    {/* Delivery address summary */}
                    <div className="border border-gold bg-surface p-5 sm:p-6">
                        <div className="flex items-center justify-between">
                            <h2 className={`${cinzel.className} text-[20px] text-gold`}>
                                Delivering To
                            </h2>
                            <button
                                onClick={() => router.push('/checkout/delivery')}
                                className="font-sans text-[12px] text-gold hover:text-gold-hover transition-colors"
                            >
                                Edit
                            </button>
                        </div>
                        <div className="mt-3 space-y-1 font-sans text-[13px] text-text-primary">
                            <p>{address.full_name}</p>
                            <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                            <p>{address.city}, {address.state} {address.postal_code}</p>
                            <p className="text-text-muted">{address.country} · {address.phone}</p>
                        </div>
                    </div>

                    {/* Payment info */}
                    <div className="border border-gold bg-surface p-5 sm:p-6">
                        <h2 className={`${cinzel.className} text-[20px] text-gold`}>
                            Payment
                        </h2>
                        <p className="mt-3 font-sans text-[13px] text-text-muted leading-[1.7]">
                            Secure payment powered by Razorpay. Supports UPI, cards, net banking, and wallets.
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            {['UPI', 'Visa', 'Mastercard', 'Amex', 'Net Banking', 'Wallets'].map((m) => (
                                <span
                                    key={m}
                                    className="border border-gold/20 px-3 py-1 font-sans text-[11px] text-text-muted"
                                >
                                    {m}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Coupon */}
                    <div className="border border-gold bg-surface p-5 sm:p-6">
                        <h2 className={`${cinzel.className} text-[20px] text-gold`}>
                            Coupon Code
                        </h2>
                        {couponDiscount > 0 ? (
                            <div className="mt-3 flex items-center justify-between border border-[var(--status-success)]/30 bg-[var(--status-success)]/10 px-4 py-3">
                                <div>
                                    <p className="font-sans text-[13px] font-semibold text-[var(--status-success)]">
                                        {couponCode} applied
                                    </p>
                                    <p className="font-sans text-[12px] text-text-muted">
                                        -{formatPrice(couponDiscount)} discount
                                    </p>
                                </div>
                                <button
                                    onClick={handleRemoveCoupon}
                                    className="font-sans text-[12px] text-[var(--status-error)] hover:opacity-80 transition-opacity"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <div className="mt-3 flex gap-2">
                                <input
                                    type="text"
                                    value={couponInput}
                                    onChange={(e) => {
                                        setCouponInput(e.target.value.toUpperCase())
                                        setCouponError('')
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                    placeholder="Enter coupon code"
                                    className="h-[42px] flex-1 border border-gold/20 bg-primary px-4 font-sans text-[13px] text-text-primary outline-none placeholder:text-text-muted focus:border-gold/50 transition-colors"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={couponLoading || !couponInput.trim()}
                                    className="btn-primary px-5 text-[11px] disabled:opacity-50"
                                >
                                    {couponLoading ? '...' : 'Apply'}
                                </button>
                            </div>
                        )}
                        {couponError && (
                            <p className="mt-2 font-sans text-[12px] text-[var(--status-error)]">
                                {couponError}
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Right — Order summary ───────────────── */}
                <div className="space-y-4">
                    <div className="border border-gold bg-surface p-5">
                        <h3 className={`${cinzel.className} text-[20px] text-gold`}>
                            Order Summary
                        </h3>
                        <div className="mt-4 space-y-3">
                            {items.map((item) => (
                                <div key={item.variantId} className="flex items-center justify-between gap-3 text-[13px]">
                                    <div className="min-w-0">
                                        <p className="truncate text-text-primary">{item.name}</p>
                                        <p className="text-[11px] text-text-muted">
                                            {item.color} / {item.size} × {item.quantity}
                                        </p>
                                    </div>
                                    <span className="flex-shrink-0 text-gold">
                                        {formatPrice(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="my-4 h-px w-full bg-gold/10" />
                        <div className="space-y-2 text-[13px]">
                            <div className="flex justify-between text-text-muted">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            {couponDiscount > 0 && (
                                <div className="flex justify-between text-[var(--status-success)]">
                                    <span>Coupon ({couponCode})</span>
                                    <span>-{formatPrice(couponDiscount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-text-muted">
                                <span>Shipping</span>
                                <span className="text-[var(--status-success)]">Free</span>
                            </div>
                            <div className="my-2 h-px w-full bg-gold/10" />
                            <div className="flex justify-between font-semibold">
                                <span className="text-text-primary">Total</span>
                                <span className="text-[16px] text-gold">{formatPrice(total)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            type="button"
                            onClick={handlePay}
                            disabled={paying || !scriptLoaded}
                            className="btn-primary w-full text-[12px] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {paying
                                ? 'Opening Payment...'
                                : !scriptLoaded
                                    ? 'Loading...'
                                    : `Pay ${formatPrice(total)}`}
                        </button>
                        <button
                            onClick={() => router.push('/checkout/delivery')}
                            className="border border-gold/30 px-4 py-3 text-center font-sans text-[12px] uppercase tracking-[0.3em] text-text-muted transition-colors hover:border-gold hover:text-gold"
                        >
                            Back to Delivery
                        </button>
                    </div>

                    <p className="font-sans text-[11px] leading-[1.7] text-text-muted">
                        By placing this order you agree to our{' '}
                        <a href="/terms" className="text-gold hover:text-gold-hover">Terms</a>{' '}
                        and{' '}
                        <a href="/privacy-policy" className="text-gold hover:text-gold-hover">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </>
    )
}