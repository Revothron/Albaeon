'use client'

import { use, useEffect } from 'react'
import Link from 'next/link'
import { Cinzel } from 'next/font/google'
import { Check } from 'lucide-react'
import { useCheckoutStore } from '@/store/checkoutStore'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '600', '700'] })

export default function ConfirmationContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ order?: string }>
}) {
  const searchParams = use(searchParamsPromise)
  const { address, clearCheckout } = useCheckoutStore()

  const orderNumber = searchParams.order ?? 'ALB-XXXXX'

  // Clear checkout store after showing confirmation
  useEffect(() => {
    const timer = setTimeout(() => clearCheckout(), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">

        {/* Success banner */}
        <div className="border border-[var(--status-success)]/40 bg-[var(--status-success)]/10 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-[var(--status-success)] bg-primary">
              <Check className="h-5 w-5 text-[var(--status-success)]" />
            </div>
            <div className="space-y-1.5">
              <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-text-muted">
                Order Confirmed
              </p>
              <h2 className={`${cinzel.className} text-[28px] text-gold sm:text-[32px]`}>
                {orderNumber}
              </h2>
              <p className="font-sans text-[13px] leading-[1.7] text-text-muted">
                A confirmation email has been sent to {address?.email ?? 'your email'}. We will notify you when your order ships.
              </p>
            </div>
          </div>
        </div>

        {/* Delivery address */}
        {address && (
          <div className="border border-gold bg-surface p-6">
            <h3 className={`${cinzel.className} text-[20px] text-gold`}>
              Delivering To
            </h3>
            <div className="mt-3 space-y-1 font-sans text-[13px] text-text-primary">
              <p>{address.full_name}</p>
              <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
              <p>{address.city}, {address.state} {address.postal_code}</p>
              <p className="text-text-muted">{address.country} · {address.phone}</p>
            </div>
          </div>
        )}

        {/* What's next */}
        <div className="border border-gold bg-surface p-6">
          <h3 className={`${cinzel.className} text-[20px] text-gold`}>
            What Happens Next
          </h3>
          <div className="mt-4 space-y-4">
            {[
              { step: '01', title: 'Order Confirmed', desc: 'Your order has been received and payment confirmed.' },
              { step: '02', title: 'Production', desc: address?.country === 'IN' ? 'Banian City begins printing and packing your order.' : 'Gelato begins printing your order at the nearest facility.' },
              { step: '03', title: 'Shipped', desc: 'You will receive an email with tracking details once shipped.' },
              { step: '04', title: 'Delivered', desc: `Estimated delivery: ${address?.country === 'IN' ? '5–7 business days' : '10–15 business days'}.` },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <span className={`${cinzel.className} flex-shrink-0 text-[13px] text-gold/50`}>
                  {item.step}
                </span>
                <div>
                  <p className="font-sans text-[13px] font-semibold text-text-primary">
                    {item.title}
                  </p>
                  <p className="font-sans text-[12px] text-text-muted">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right ───────────────────────────────── */}
      <div className="space-y-4">
        <div className="border border-gold bg-surface p-5">
          <h3 className={`${cinzel.className} text-[20px] text-gold`}>
            Manage Your Order
          </h3>
          <div className="mt-4 space-y-3">
            <Link
              href={`/account/orders`}
              className="flex w-full items-center justify-between border border-gold/20 px-4 py-3 font-sans text-[13px] text-text-primary transition-colors hover:border-gold hover:text-gold"
            >
              <span>View Order</span>
              <span className="text-gold">→</span>
            </Link>
            <Link
              href="/track-order"
              className="flex w-full items-center justify-between border border-gold/20 px-4 py-3 font-sans text-[13px] text-text-primary transition-colors hover:border-gold hover:text-gold"
            >
              <span>Track Order</span>
              <span className="text-gold">→</span>
            </Link>
          </div>
        </div>

        <Link href="/shop" className="btn-primary block w-full text-center text-[12px]">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}