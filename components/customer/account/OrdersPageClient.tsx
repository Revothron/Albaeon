'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Cinzel } from 'next/font/google'
import { ChevronDown, Search } from 'lucide-react'
import { useState } from 'react'
import AccountShell from '@/components/customer/account/AccountShell'
import type { CustomerOrder } from '@/lib/customer/orders'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5 border border-gold bg-surface p-4">
      <p className="font-sans text-[12px] text-text-muted">{label}</p>
      <p className={`${cinzel.className} text-[30px] text-gold xl:text-[36px]`}>{value}</p>
    </div>
  )
}

function StatusStep({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-gold' : 'bg-text-muted/45'}`} />
      <span className={`font-sans text-[10px] ${active ? 'text-gold' : 'text-text-muted'}`}>{label}</span>
    </div>
  )
}

function getStatusClassName(status: string) {
  switch (status) {
    case 'Shipped': return 'badge-info'
    case 'Delivered': return 'badge-success'
    case 'Cancelled': return 'badge-error'
    default: return 'badge-warning'
  }
}

function getStatusProgress(status: string) {
  switch (status) {
    case 'Processing': return 2
    case 'Shipped': return 3
    case 'Delivered': return 5
    default: return 1
  }
}

export default function OrdersPageClient({
  orders,
  metrics,
  getOrderListMeta,
  formatOrderAmount,
}: {
  orders: CustomerOrder[]
  metrics: { label: string; value: string }[]
  getOrderListMeta: (o: CustomerOrder) => string
  formatOrderAmount: (amount: number, prefix: '₹' | 'Rs' | 'INR') => string
}) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all-orders')

  const filtered = orders.filter((o) => {
    const matchesSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()))

    const matchesFilter =
      filter === 'all-orders' ||
      o.status.toLowerCase() === filter

    return matchesSearch && matchesFilter
  })

  if (orders.length === 0) {
    return (
      <div className="animate-fadeInUp">
        <AccountShell
          activeTab="orders"
          title="My Orders"
          subtitle="View and track all your Albaeon orders from one place."
        >
          <div className="flex flex-col items-center py-16 text-center">
            <p className="font-sans text-[24px] font-light text-text-muted mb-3">No orders yet.</p>
            <p className="font-sans text-[13px] text-text-muted mb-7 max-w-[280px] leading-[1.7]">
              Your order history will appear here once you place your first order.
            </p>
            <a href="/shop" className="btn-primary">Start Shopping</a>
          </div>
        </AccountShell>
      </div>
    )
  }

  const featuredOrder = filtered[0]
  const otherOrders = filtered.slice(1)

  return (
    <div className="animate-fadeInUp">
      <AccountShell
        activeTab="orders"
        title="My Orders"
        subtitle="View and track all your Albaeon orders from one place."
      >
        <div className="space-y-4">
          <div className="grid gap-3.5 lg:grid-cols-2 2xl:grid-cols-3">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} label={metric.label} value={metric.value} />
            ))}
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders by number or product name..."
                className="w-full border border-gold bg-surface pl-10 pr-4 font-sans text-[13px] text-text-primary outline-none placeholder:text-text-muted py-2"
              />
            </label>

            <div className="relative w-full md:w-[176px]">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full appearance-none border border-gold bg-surface px-4 pr-10 font-sans text-[12px] text-text-primary outline-none py-2"
              >
                <option value="all-orders">All Orders</option>
                <option value="shipped">Shipped</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="font-sans text-[14px] text-text-muted py-8 text-center">No orders match your search.</p>
          ) : (
            <div className="space-y-2">
              {/* Featured order */}
              {featuredOrder && (
                <div className="space-y-3.5 border border-gold bg-surface px-4 py-4 sm:px-6 sm:py-5 card-hover">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <Link
                        href={`/account/orders/${featuredOrder.id}`}
                        className="font-sans text-[14px] text-gold transition-colors duration-200 hover:text-gold-hover"
                      >
                        {`#${featuredOrder.id} — ${featuredOrder.items[0]?.name ?? 'Order'}`}
                      </Link>
                      <p className="font-sans text-[12px] text-text-muted">
                        {getOrderListMeta(featuredOrder)}
                      </p>
                    </div>
                    <p className={`badge ${getStatusClassName(featuredOrder.status)}`}>
                      {featuredOrder.status}
                    </p>
                  </div>

                  <div className="h-px w-full bg-gold/10" />

                  <div className="flex flex-col gap-4 lg:flex-row">
                    <div className="relative h-14 w-14 overflow-hidden border border-gold bg-primary-deep">
                      <Image
                        src={featuredOrder.items[0]?.image ?? '/placeholder.png'}
                        alt={featuredOrder.items[0]?.name ?? 'Product'}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <p className="font-sans text-[14px] text-gold">{featuredOrder.items[0]?.name}</p>
                      <p className="font-sans text-[12px] text-text-muted">
                        {`${featuredOrder.items[0]?.color} / ${featuredOrder.items[0]?.size} / Qty ${featuredOrder.items[0]?.quantity}`}
                      </p>
                      <p className={`${cinzel.className} text-[16px] text-gold`}>
                        {formatOrderAmount(featuredOrder.payment.amountCharged, '₹')}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        {[
                          { label: 'Ordered', step: 1 },
                          { label: 'Processing', step: 2 },
                          { label: 'Shipped', step: 3 },
                          { label: 'Delivered', step: 5 },
                        ].map((s, i, arr) => (
                          <span key={s.label} className="flex items-center gap-3">
                            <StatusStep
                              active={getStatusProgress(featuredOrder.status) >= s.step}
                              label={s.label}
                            />
                            {i < arr.length - 1 && (
                              <div className={`h-px w-10 ${getStatusProgress(featuredOrder.status) > s.step ? 'bg-gold' : 'bg-text-muted/45'}`} />
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
                      <Link
                        href={`/track-order?orderId=${encodeURIComponent(featuredOrder.id)}`}
                        className="btn-secondary"
                      >
                        Track Order
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Other orders */}
              {otherOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="group flex flex-col gap-3 border border-gold bg-surface px-4 py-4 transition-colors duration-200 hover:border-gold-hover sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5 card-hover"
                >
                  <div className="space-y-1">
                    <p className="font-sans text-[14px] text-gold">
                      {`#${order.id} — ${order.items[0]?.name ?? 'Order'}`}
                    </p>
                    <p className="font-sans text-[12px] text-text-muted">
                      {getOrderListMeta(order)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className={`badge ${getStatusClassName(order.status)}`}>{order.status}</p>
                    <span className="btn-secondary">View Details</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="flex flex-col items-center gap-1 py-2 text-center">
            <p className="font-sans text-[12px] text-text-muted">
              {`Showing ${filtered.length} of ${orders.length} orders`}
            </p>
          </div>
        </div>
      </AccountShell>
    </div>
  )
}