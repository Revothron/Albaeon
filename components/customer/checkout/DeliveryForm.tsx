'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Cinzel } from 'next/font/google'
import { useCheckoutStore, type CheckoutAddress } from '@/store/checkoutStore'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/lib/supabase/client'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '600', '700'] })

function Field({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = 'text',
    span = 'full',
    required = false,
}: {
    label: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder: string
    type?: string
    span?: 'full' | 'half'
    required?: boolean
}) {
    return (
        <label className={`flex flex-col gap-2 ${span === 'half' ? 'lg:col-span-1' : 'lg:col-span-2'}`}>
            <span className="font-sans text-[11px] uppercase tracking-[0.32em] text-text-muted">
                {label}{required && <span className="ml-1 text-gold">*</span>}
            </span>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="h-[44px] border border-gold/20 bg-primary px-4 font-sans text-[13px] text-text-primary outline-none placeholder:text-text-muted focus:border-gold/50 transition-colors"
            />
        </label>
    )
}

const COUNTRIES = [
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'SG', name: 'Singapore' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'NL', name: 'Netherlands' },
]

export default function DeliveryForm() {
    const router = useRouter()
    const { address: savedAddress, setAddress } = useCheckoutStore()
    const items = useCartStore((s) => s.items)
    const subtotal = useCartStore((s) => s.subtotal())

    const [form, setForm] = useState<CheckoutAddress>({
        full_name: savedAddress?.full_name ?? '',
        email: savedAddress?.email ?? '',
        phone: savedAddress?.phone ?? '',
        line1: savedAddress?.line1 ?? '',
        line2: savedAddress?.line2 ?? '',
        city: savedAddress?.city ?? '',
        state: savedAddress?.state ?? '',
        postal_code: savedAddress?.postal_code ?? '',
        country: savedAddress?.country ?? 'IN',
    })

    const [errors, setErrors] = useState<Partial<CheckoutAddress>>({})

    // Pre-fill from user profile
    useEffect(() => {
        if (savedAddress) return
        const supabase = createClient()
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) return
            supabase
                .from('profiles')
                .select('first_name, last_name, email, phone')
                .eq('id', user.id)
                .single()
                .then(({ data }) => {
                    if (!data) return
                    setForm((f) => ({
                        ...f,
                        full_name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim(),
                        email: data.email ?? user.email ?? '',
                        phone: data.phone ?? '',
                    }))
                })
        })
    }, [])

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target
        setForm((f) => ({ ...f, [name]: value }))
        if (errors[name as keyof CheckoutAddress]) {
            setErrors((e) => ({ ...e, [name]: '' }))
        }
    }

    function validate(): boolean {
        const required: (keyof CheckoutAddress)[] = [
            'full_name', 'email', 'phone', 'line1', 'city', 'state', 'postal_code', 'country',
        ]
        const newErrors: Partial<CheckoutAddress> = {}
        for (const key of required) {
            if (!form[key]?.trim()) newErrors[key] = 'Required'
        }
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Invalid email'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    function handleContinue() {
        if (!validate()) return
        setAddress(form)
        router.push('/checkout/payment')
    }

    if (items.length === 0) {
        router.replace('/cart')
        return null
    }

    const currency = items[0]?.currency ?? 'INR'
    const formatPrice = (n: number) =>
        currency === 'INR' ? `₹${n.toLocaleString('en-IN')}` : `$${n.toFixed(2)}`

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* ── Left — Address form ─────────────────── */}
            <div className="space-y-5">
                <div className="border border-gold bg-surface p-5 sm:p-6">
                    <h2 className={`${cinzel.className} text-[22px] text-gold sm:text-[26px]`}>
                        Shipping Address
                    </h2>
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <Field
                            label="Full Name" name="full_name" value={form.full_name}
                            onChange={handleChange} placeholder="Alex Morgan"
                            span="full" required
                        />
                        <Field
                            label="Email" name="email" value={form.email} type="email"
                            onChange={handleChange} placeholder="alex@email.com"
                            span="half" required
                        />
                        <Field
                            label="Phone" name="phone" value={form.phone}
                            onChange={handleChange} placeholder="+91 98765 43210"
                            span="half" required
                        />
                        <Field
                            label="Address Line 1" name="line1" value={form.line1}
                            onChange={handleChange} placeholder="42, MG Road"
                            span="full" required
                        />
                        <Field
                            label="Apartment / Suite (optional)" name="line2" value={form.line2}
                            onChange={handleChange} placeholder="Indiranagar"
                            span="full"
                        />
                        <Field
                            label="City" name="city" value={form.city}
                            onChange={handleChange} placeholder="Bengaluru"
                            span="half" required
                        />
                        <Field
                            label="State / Province" name="state" value={form.state}
                            onChange={handleChange} placeholder="Karnataka"
                            span="half" required
                        />
                        <Field
                            label="Postal Code" name="postal_code" value={form.postal_code}
                            onChange={handleChange} placeholder="560038"
                            span="half" required
                        />

                        {/* Country select */}
                        <label className="flex flex-col gap-2 lg:col-span-1">
                            <span className="font-sans text-[11px] uppercase tracking-[0.32em] text-text-muted">
                                Country <span className="text-gold">*</span>
                            </span>
                            <select
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                className="h-[44px] border border-gold/20 bg-primary px-4 font-sans text-[13px] text-text-primary outline-none focus:border-gold/50 transition-colors"
                            >
                                {COUNTRIES.map((c) => (
                                    <option key={c.code} value={c.code}>{c.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {/* Validation errors */}
                    {Object.keys(errors).length > 0 && (
                        <p className="mt-4 font-sans text-[12px] text-[var(--status-error)]">
                            Please fill all required fields correctly.
                        </p>
                    )}
                </div>

                {/* Delivery method — standard only for now */}
                <div className="border border-gold bg-surface p-5 sm:p-6">
                    <h2 className={`${cinzel.className} text-[22px] text-gold sm:text-[26px]`}>
                        Delivery
                    </h2>
                    <div className="mt-4 flex items-start gap-3 border border-gold bg-primary-deep px-4 py-3">
                        <div className="mt-1 h-3.5 w-3.5 flex-shrink-0 rounded-full border border-gold bg-gold" />
                        <div>
                            <p className="font-sans text-[13px] font-semibold text-text-primary">
                                Standard Delivery · {form.country === 'IN' ? '5–7 days' : '10–15 days'}
                            </p>
                            <p className="font-sans text-[12px] text-text-muted">
                                Free on all orders
                            </p>
                        </div>
                    </div>
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
                        <div className="flex justify-between text-text-muted">
                            <span>Shipping</span>
                            <span className="text-[var(--status-success)]">Free</span>
                        </div>
                        <div className="my-2 h-px w-full bg-gold/10" />
                        <div className="flex justify-between font-semibold">
                            <span className="text-text-primary">Total</span>
                            <span className="text-[16px] text-gold">{formatPrice(subtotal)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={handleContinue}
                        className="btn-primary w-full text-[12px]"
                    >
                        Continue to Payment
                    </button>

                    href="/cart"
                    className="border border-gold/30 px-4 py-3 text-center font-sans text-[12px] uppercase tracking-[0.3em] text-text-muted transition-colors hover:border-gold hover:text-gold"
                    <a>
                        Back to Cart
                    </a>
                </div>
            </div>
        </div >
    )
}