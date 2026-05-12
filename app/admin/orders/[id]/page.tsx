import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { adminCinzel, adminCormorant, adminRaleway } from '@/components/admin/adminFonts'
import { requireAdminPage } from '@/lib/auth/require-admin-page'
import { getAdminOrderById } from '@/lib/admin/orders'
import AdminOrderActions from '@/components/admin/AdminOrderActions'
import GelatoFulfillmentStatus from '@/components/admin/GelatoFulfillmentStatus'

type Tone = 'success' | 'info' | 'warning' | 'danger' | 'muted'

const tonePalette: Record<Tone, { text: string; border: string; bg: string }> = {
  success: { text: 'var(--status-success)', border: '#4CAF7D40', bg: '#4CAF7D1F' },
  info: { text: 'var(--status-info)', border: '#4A90C44D', bg: '#4A90C41F' },
  warning: { text: 'var(--status-warning)', border: '#E6A8174D', bg: '#E6A8171F' },
  danger: { text: 'var(--status-error)', border: '#C0392B4D', bg: '#C0392B1F' },
  muted: { text: 'var(--text-muted)', border: '#E6C9791F', bg: '#E6C9790F' },
}

function getStatusTone(status: string): Tone {
  switch (status) {
    case 'delivered': return 'success'
    case 'shipped': return 'info'
    case 'processing': return 'warning'
    case 'cancelled': return 'danger'
    default: return 'muted'
  }
}

function getPaymentTone(status: string): Tone {
  switch (status) {
    case 'paid': return 'success'
    case 'failed': return 'danger'
    case 'refunded': return 'info'
    default: return 'warning'
  }
}

function getInitials(name: string) {
  return name.split(' ').filter(Boolean).map((p) => p[0]).join('').slice(0, 2).toUpperCase()
}

function HeaderStatusBadge({ label, tone }: { label: string; tone: Tone }) {
  const p = tonePalette[tone]
  return (
    <span
      className={`${adminCinzel.className} inline-flex items-center border px-4 py-[7px] text-[11px] font-semibold tracking-[0.2em]`}
      style={{ color: p.text, borderColor: p.border, backgroundColor: p.bg }}
    >
      {label.toUpperCase()}
    </span>
  )
}

function PaymentStatusBadge({ label, tone }: { label: string; tone: Tone }) {
  const p = tonePalette[tone]
  return (
    <span
      className={`${adminCinzel.className} inline-flex items-center border px-3 py-1 text-[9px] font-semibold tracking-[0.1em]`}
      style={{ color: p.text, borderColor: p.border, backgroundColor: p.bg }}
    >
      {label.toUpperCase()}
    </span>
  )
}

function DetailLabel({ children }: { children: string }) {
  return (
    <p className={`${adminCinzel.className} text-[8px] font-semibold tracking-[0.32em] text-text-muted`}>
      {children}
    </p>
  )
}

function DetailValue({ children }: { children: string }) {
  return (
    <p className={`${adminRaleway.className} text-[13px] font-light text-text-primary`}>
      {children}
    </p>
  )
}

function SectionHeading({ children }: { children: string }) {
  return (
    <p className={`${adminCinzel.className} text-[10px] font-bold tracking-[0.3em] text-gold`}>
      {children}
    </p>
  )
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function formatDateTime(d: string) {
  return new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatCurrency(amount: number, currency = 'INR') {
  if (currency === 'INR') return `₹${amount.toLocaleString('en-IN')}`
  return `$${amount.toFixed(2)}`
}

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdminPage()

  const { id } = await params
  const order = await getAdminOrderById(id)

  if (!order) notFound()

  // ── Derived data ────────────────────────────────────
  const profile = order.profiles as {
    id: string; email: string
    first_name: string; last_name: string
    phone: string; created_at: string
  } | null

  const snapshot = order.shipping_address_snapshot as {
    full_name?: string; line1?: string; line2?: string
    city?: string; state?: string; postal_code?: string
    country?: string; phone?: string
  } | null

  const tracking = Array.isArray(order.order_tracking)
    ? order.order_tracking[0]
    : order.order_tracking

  const orderItems = order.order_items as {
    id: string; product_name: string; variant_sku: string
    color: string; size: string; quantity: number
    unit_price: number; subtotal: number
    product_images?: { product_images?: { url: string; is_primary: boolean }[] }[]
  }[]

  const coupon = Array.isArray(order.coupons)
    ? order.coupons[0]
    : order.coupons as { code: string; type: string; value: number } | null

  const customerName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.email
    : (snapshot?.full_name ?? 'Guest')

  const statusTone = getStatusTone(order.status)
  const paymentTone = getPaymentTone(order.payment_status)
  const currency = order.currency ?? 'INR'

  // Timeline
  const timeline = [
    { title: 'Order placed', time: formatDateTime(order.created_at) },
    order.payment_status === 'paid'
      ? { title: 'Payment confirmed', time: formatDateTime(order.updated_at ?? order.created_at) }
      : null,
    order.status === 'processing'
      ? { title: 'Processing started', time: formatDateTime(order.updated_at ?? order.created_at) }
      : null,
    tracking?.updated_at && order.status === 'shipped'
      ? { title: 'Shipped', time: formatDateTime(tracking.updated_at) }
      : null,
    order.status === 'delivered'
      ? { title: 'Delivered', time: formatDateTime(order.updated_at ?? order.created_at) }
      : null,
    order.status === 'cancelled'
      ? { title: 'Cancelled', time: formatDateTime(order.updated_at ?? order.created_at) }
      : null,
  ].filter(Boolean) as { title: string; time: string }[]

  return (
    <div className="space-y-7 animate-fadeInUp">
      <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
        Orders / {order.order_number}
      </p>

      {/* ── Header ─────────────────────────────────── */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className={`${adminCormorant.className} text-[32px] font-light text-text-primary`}>
            Order {order.order_number}
          </h1>
          <p className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
            Placed {formatDateTime(order.created_at)} · {order.payment_gateway ?? 'Razorpay'} · {order.provider === 'banian' ? 'Banian City' : 'Gelato'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <HeaderStatusBadge
            label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            tone={statusTone}
          />
          <Link
            href="/admin/orders"
            className={`flex items-center gap-2 ${adminCinzel.className} text-[10px] font-semibold tracking-[0.2em] text-text-muted transition-colors duration-200 hover:text-gold`}
          >
            <ArrowLeft className="h-3 w-3" strokeWidth={2} />
            BACK TO ORDERS
          </Link>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">

          {/* ── Customer ───────────────────────────── */}
          <section className="border border-gold/10 bg-[#1E1A2E] p-6">
            <SectionHeading>CUSTOMER INFORMATION</SectionHeading>
            <div className="mt-4 flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold text-[14px] text-gold">
                {getInitials(customerName)}
              </div>
              <div className="space-y-1">
                <p className={`${adminRaleway.className} text-[15px] font-medium text-text-primary`}>
                  {customerName}
                </p>
                <p className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                  {profile?.email ?? snapshot?.phone ?? '—'}
                </p>
                <p className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                  {profile?.phone ?? snapshot?.phone ?? '—'}
                </p>
                {profile && (
                  <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                    Member since {formatDate(profile.created_at)}
                  </p>
                )}
              </div>
            </div>
            {profile && (
              <Link
                href={`/admin/customers/${profile.id}`}
                className={`${adminCinzel.className} mt-4 inline-flex text-[10px] font-semibold tracking-[0.2em] text-gold hover:text-gold-hover transition-colors`}
              >
                VIEW CUSTOMER →
              </Link>
            )}
          </section>

          {/* ── Shipping Address ───────────────────── */}
          <section className="border border-gold/10 bg-[#1E1A2E] p-6">
            <SectionHeading>SHIPPING ADDRESS</SectionHeading>
            <div className="mt-4 space-y-2">
              {snapshot ? (
                <>
                  <p className={`${adminRaleway.className} text-[14px] font-light text-text-primary`}>
                    {snapshot.full_name ?? customerName}
                  </p>
                  <p className={`${adminRaleway.className} text-[14px] font-light text-text-primary`}>
                    {snapshot.line1}{snapshot.line2 ? `, ${snapshot.line2}` : ''}
                  </p>
                  <p className={`${adminRaleway.className} text-[14px] font-light text-text-primary`}>
                    {snapshot.city}, {snapshot.state} {snapshot.postal_code}
                  </p>
                  <p className={`${adminRaleway.className} text-[14px] font-light text-text-primary`}>
                    {snapshot.country} · {snapshot.phone ?? profile?.phone ?? '—'}
                  </p>
                </>
              ) : (
                <p className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                  No shipping address recorded
                </p>
              )}
            </div>
          </section>

          {/* ── Order Items ────────────────────────── */}
          <section className="border border-gold/10 bg-[#1E1A2E] p-6">
            <SectionHeading>ORDER ITEMS</SectionHeading>
            <div className="mt-4 space-y-4">
              {orderItems.map((item) => {
                const imgs = item.product_images?.[0]?.product_images ?? []
                const imgUrl = imgs.find((i) => i.is_primary)?.url ?? imgs[0]?.url ?? null

                return (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden border border-gold/10 bg-nav">
                      {imgUrl && (
                        <Image src={imgUrl} alt={item.product_name} fill sizes="64px" className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className={`${adminRaleway.className} text-[14px] font-medium text-text-primary`}>
                        {item.product_name}
                      </p>
                      <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                        {item.color} / {item.size}
                      </p>
                      <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                        SKU: {item.variant_sku}
                      </p>
                      <p className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                        Qty: {item.quantity} × {formatCurrency(item.unit_price, currency)}
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className={`${adminCinzel.className} text-[15px] text-gold`}>
                        {formatCurrency(item.subtotal, currency)}
                      </p>
                    </div>
                  </div>
                )
              })}

              <div className="h-px w-full bg-gold/10" />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>Subtotal</span>
                  <span className={`${adminRaleway.className} text-[13px] font-light text-text-primary`}>
                    {formatCurrency(order.subtotal, currency)}
                  </span>
                </div>
                {order.discount_amount > 0 && coupon && (
                  <div className="flex items-center justify-between">
                    <span className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                      Coupon ({coupon.code})
                    </span>
                    <span className={`${adminRaleway.className} text-[13px] font-light text-[var(--status-success)]`}>
                      -{formatCurrency(order.discount_amount, currency)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>Shipping</span>
                  <span className={`${adminRaleway.className} text-[13px] font-light ${order.shipping_amount === 0 ? 'text-[var(--status-success)]' : 'text-text-primary'}`}>
                    {order.shipping_amount === 0 ? 'Free' : formatCurrency(order.shipping_amount, currency)}
                  </span>
                </div>
              </div>

              <div className="h-px w-full bg-gold/10" />

              <div className="flex items-center justify-between">
                <span className={`${adminCinzel.className} text-[12px] font-semibold tracking-[0.1em] text-text-primary`}>TOTAL</span>
                <span className={`${adminCinzel.className} text-[16px] font-semibold text-gold`}>
                  {formatCurrency(order.total_amount, currency)}
                </span>
              </div>
            </div>
          </section>

          {/* ── Payment ────────────────────────────── */}
          <section className="border border-gold/10 bg-[#1E1A2E] p-6">
            <SectionHeading>PAYMENT DETAILS</SectionHeading>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <DetailLabel>GATEWAY</DetailLabel>
                <DetailValue>{(order.payment_gateway ?? 'razorpay').toUpperCase()}</DetailValue>
                <DetailLabel>TRANSACTION ID</DetailLabel>
                <DetailValue>{order.payment_id ?? '—'}</DetailValue>
                <DetailLabel>CURRENCY</DetailLabel>
                <DetailValue>{currency}</DetailValue>
              </div>
              <div className="space-y-3">
                <DetailLabel>PAYMENT STATUS</DetailLabel>
                <PaymentStatusBadge
                  label={order.payment_status}
                  tone={paymentTone}
                />
                <DetailLabel>AMOUNT CHARGED</DetailLabel>
                <p className={`${adminCinzel.className} text-[18px] font-light text-gold`}>
                  {formatCurrency(order.total_amount, currency)}
                </p>
                <DetailLabel>DATE</DetailLabel>
                <DetailValue>{formatDateTime(order.created_at)}</DetailValue>
              </div>
            </div>
          </section>

          {/* ── Fulfillment ────────────────────────── */}
          <section className="border border-gold/10 bg-[#1E1A2E] p-6">
            <SectionHeading>FULFILLMENT DETAILS</SectionHeading>
            <div className="mt-4 space-y-5">

              {/* Provider + basic info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <DetailLabel>PROVIDER</DetailLabel>
                  <DetailValue>
                    {order.provider === 'banian' ? 'Banian City (India)' : 'Gelato (International)'}
                  </DetailValue>

                  {/* Banian City — form submission status */}
                  {order.provider === 'banian' && (
                    <>
                      <DetailLabel>FORM STATUS</DetailLabel>
                      <DetailValue>
                        {tracking?.banian_form_response ? 'Submitted to Banian City' : 'Not yet submitted'}
                      </DetailValue>
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  <DetailLabel>TRACKING NUMBER</DetailLabel>
                  <p className={`${adminCinzel.className} text-[14px] text-text-primary`}>
                    {tracking?.tracking_number ?? '—'}
                  </p>

                  <DetailLabel>COURIER</DetailLabel>
                  <DetailValue>{tracking?.courier ?? '—'}</DetailValue>

                  {tracking?.courier_url && (
                    <a
                      href={tracking.courier_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${adminRaleway.className} text-[13px] font-light text-gold hover:text-gold-hover transition-colors`}
                    >
                      <DetailLabel>TRACKING LINK</DetailLabel>
                      Track shipment →
                    </a>
                  )}
                </div>

                {tracking?.estimated_delivery && (
                  <>
                    <DetailLabel>ESTIMATED DELIVERY</DetailLabel>
                    <DetailValue>{formatDate(tracking.estimated_delivery)}</DetailValue>
                  </>
                )}
              </div>
            </div>

            {/* Gelato live status — only shown for Gelato orders with a gelato_order_id */}
            {order.provider === 'gelato' && tracking?.gelato_order_id && (
              <div className="border-t border-gold/10 pt-5">
                <p className={`${adminCinzel.className} mb-4 text-[9px] tracking-[0.28em] text-gold`}>
                  LIVE GELATO STATUS
                </p>
                <GelatoFulfillmentStatus gelatoOrderId={tracking.gelato_order_id} />
              </div>
            )}

            {/* Gelato order not yet created */}
            {order.provider === 'gelato' && !tracking?.gelato_order_id && (
              <div className="border-t border-gold/10 pt-4">
                <p className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>
                  Gelato order not yet created. Will be triggered automatically after payment confirmation.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* ── Right sidebar (actions) ─────────────── */}
        <div className="space-y-4 lg:w-[280px]">
          <AdminOrderActions
            orderId={order.id}
            currentStatus={order.status}
            currentNotes={order.notes ?? ''}
            currentTracking={{
              tracking_number: tracking?.tracking_number ?? '',
              courier: tracking?.courier ?? '',
              courier_url: tracking?.courier_url ?? '',
            }}
          />

          {/* Timeline */}
          <section className="border border-gold/10 bg-[#1E1A2E] p-6">
            <SectionHeading>ORDER TIMELINE</SectionHeading>
            <div className="mt-4 space-y-3">
              {timeline.map((event, index) => (
                <div key={event.title} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-gold" />
                    {index < timeline.length - 1 && (
                      <div className="mt-1 h-6 w-px bg-gold/60" />
                    )}
                  </div>
                  <div>
                    <p className={`${adminRaleway.className} text-[13px] font-medium text-text-primary`}>
                      {event.title}
                    </p>
                    <p className={`${adminRaleway.className} text-[12px] font-light text-text-muted`}>
                      {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div >
    </div >
  )
}