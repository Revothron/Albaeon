'use client'

import Link from 'next/link'
import { ChevronDown, Download, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  AdminDateRangeBox,
  AdminFieldLabel,
  AdminOutlineButton,
  AdminPagination,
  AdminPageHeading,
  AdminStatusBadge,
  AdminTextInput,
} from '@/components/admin/AdminUi'
import { adminCinzel, adminRaleway } from '@/components/admin/adminFonts'
import type { AdminOrder } from '@/lib/admin/orders'

const headerColumns = ['', 'ORDER ID', 'CUSTOMER', 'DATE', 'AMOUNT', 'PAYMENT', 'FULFILLMENT', 'PROVIDER', 'ACTION']
const paymentOptions = ['All', 'Paid', 'Pending', 'Failed']
const fulfillmentOptions = ['All', 'Shipped', 'Delivered', 'Processing', 'Pending', 'Cancelled']
const providerOptions = ['All', 'Banian City', 'Gelato']

function CheckCell() {
  return <span className="inline-flex h-3 w-3 border border-text-muted/60" aria-hidden="true" />
}

function FilterDropdown({
  id, value, options, openId, onToggle, onSelect,
}: {
  id: string
  value: string
  options: string[]
  openId: string | null
  onToggle: (id: string) => void
  onSelect: (id: string, value: string) => void
}) {
  const isOpen = openId === id
  return (
    <div className="group relative w-full" data-filter-dropdown>
      <button
        type="button"
        className={`flex h-[46px] min-h-[46px] w-full items-center justify-between border border-gold/12 bg-footer px-3 text-left ${adminRaleway.className} text-[13px] font-light text-text-primary transition-colors duration-200 hover:border-gold/30`}
        aria-expanded={isOpen}
        onClick={() => onToggle(id)}
      >
        <span>{value}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={1.8} />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-20 w-full min-w-[160px] border border-gold/12 bg-nav p-2 shadow-[0_16px_36px_rgba(0,0,0,0.45)]">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`${adminRaleway.className} flex w-full items-center px-3 py-2 text-left text-[12px] font-light text-text-primary transition-colors duration-200 hover:bg-gold/8 hover:text-gold`}
              onClick={() => { onSelect(id, option); onToggle(id) }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminOrdersClient({
  orders,
  total,
  currentPage,
}: {
  orders: AdminOrder[]
  total: number
  currentPage: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [payment, setPayment] = useState(searchParams.get('payment') ?? 'All')
  const [fulfillment, setFulfillment] = useState(searchParams.get('fulfillment') ?? 'All')
  const [provider, setProvider] = useState(searchParams.get('provider') ?? 'All')

  const totalPages = Math.ceil(total / 20)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return
      if (!e.target.closest('[data-filter-dropdown]')) setOpenDropdown(null)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([k, v]) => {
      if (v && v !== 'All') params.set(k, v)
      else params.delete(k)
    })
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleSelect(id: string, value: string) {
    if (id === 'payment') { setPayment(value); updateParams({ payment: value, fulfillment, provider }) }
    if (id === 'fulfillment') { setFulfillment(value); updateParams({ payment, fulfillment: value, provider }) }
    if (id === 'provider') { setProvider(value); updateParams({ payment, fulfillment, provider: value }) }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateParams({ search, payment, fulfillment, provider })
  }

  function handleReset() {
    setSearch(''); setPayment('All'); setFulfillment('All'); setProvider('All')
    router.push(pathname)
  }

  return (
    <div className="space-y-5 md:space-y-6 animate-fadeInUp">
      <AdminPageHeading
        eyebrow="ORDERS"
        title="Orders"
        subtitle={`${total.toLocaleString('en-IN')} total orders`}
        action={<AdminOutlineButton label="EXPORT CSV" icon={<Download className="h-3.5 w-3.5" strokeWidth={1.8} />} />}
      />

      <section className="border border-gold/10 bg-[#1E1A2E] px-5 py-4 md:px-6">
        <form
          onSubmit={handleSearch}
          className="grid gap-3 md:grid-cols-2 lg:grid-cols-[220px_140px_160px_120px_minmax(200px,1fr)_90px] lg:items-end"
        >
          <div>
            <AdminFieldLabel>DATE RANGE</AdminFieldLabel>
            <AdminDateRangeBox fromLabel="From date" toLabel="To date" />
          </div>
          <div>
            <AdminFieldLabel>PAYMENT STATUS</AdminFieldLabel>
            <FilterDropdown id="payment" value={payment} options={paymentOptions} openId={openDropdown} onToggle={(id) => setOpenDropdown((c) => c === id ? null : id)} onSelect={handleSelect} />
          </div>
          <div>
            <AdminFieldLabel>FULFILLMENT STATUS</AdminFieldLabel>
            <FilterDropdown id="fulfillment" value={fulfillment} options={fulfillmentOptions} openId={openDropdown} onToggle={(id) => setOpenDropdown((c) => c === id ? null : id)} onSelect={handleSelect} />
          </div>
          <div>
            <AdminFieldLabel>PROVIDER</AdminFieldLabel>
            <FilterDropdown id="provider" value={provider} options={providerOptions} openId={openDropdown} onToggle={(id) => setOpenDropdown((c) => c === id ? null : id)} onSelect={handleSelect} />
          </div>
          <div>
            <AdminFieldLabel>SEARCH ORDER</AdminFieldLabel>
            <AdminTextInput
              placeholder="Order ID, customer name..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="min-w-0"
            />
          </div>
          <div className="self-end justify-self-start lg:justify-self-end">
            <button
              type="button"
              onClick={handleReset}
              className={`${adminRaleway.className} inline-flex h-[46px] min-h-[46px] items-center border border-gold/20 px-4 text-[12px] text-text-muted transition-colors duration-200 hover:text-text-primary`}
            >
              RESET
            </button>
          </div>
        </form>
      </section>

      <section className="border border-gold/10 bg-[#1E1A2E]">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[900px] border-collapse">
            <thead className="bg-nav">
              <tr className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-text-muted`}>
                {headerColumns.map((col, i) => (
                  <th key={`${col}-${i}`} className="px-3 py-4 text-center font-semibold md:px-6">
                    {col || <CheckCell />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className={`${adminRaleway.className} py-12 text-center text-[13px] text-text-muted`}>
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="card-hover border-t border-gold/6">
                    <td className="px-3 py-4 text-center md:px-6"><CheckCell /></td>
                    <td className={`${adminCinzel.className} px-3 py-4 text-center text-[13px] text-gold md:px-6`}>{order.id}</td>
                    <td className="px-3 py-4 text-center md:px-6">
                      <div className="space-y-1">
                        <p className={`${adminRaleway.className} text-[13px] font-medium text-text-primary`}>{order.customer}</p>
                        <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>{order.email}</p>
                      </div>
                    </td>
                    <td className={`${adminRaleway.className} px-3 py-4 text-center text-[13px] font-light text-text-muted md:px-6`}>{order.date}</td>
                    <td className={`${adminCinzel.className} px-3 py-4 text-center text-[13px] text-text-primary md:px-6`}>{order.amount}</td>
                    <td className="px-3 py-4 text-center md:px-6">
                      <AdminStatusBadge label={order.payment.label} tone={order.payment.tone} />
                    </td>
                    <td className="px-3 py-4 text-center md:px-6">
                      <AdminStatusBadge label={order.fulfillment.label} tone={order.fulfillment.tone} />
                    </td>
                    <td className={`${adminRaleway.className} px-3 py-4 text-center text-[12px] font-light text-text-muted md:px-6`}>{order.provider}</td>
                    <td className="px-3 py-4 text-center md:px-6">
                      <Link href={`/admin/orders/${order.id.toLowerCase()}`} className="inline-flex text-gold transition-colors duration-200 hover:text-gold-hover" aria-label={`View ${order.id}`}>
                        <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          summary={`Showing ${Math.min((currentPage - 1) * 20 + 1, total)}-${Math.min(currentPage * 20, total)} of ${total.toLocaleString('en-IN')} orders`}
          pages={totalPages <= 5
            ? Array.from({ length: totalPages }, (_, i) => i + 1)
            : [1, 2, 3, '...', totalPages]}
          currentPage={currentPage}
        />
      </section>
    </div>
  )
}