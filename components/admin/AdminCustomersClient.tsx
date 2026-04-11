'use client'

import Link from 'next/link'
import { ChevronDown, Download, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  AdminOutlineButton,
  AdminPagination,
  AdminPageHeading,
  AdminTextInput,
} from '@/components/admin/AdminUi'
import { adminCinzel, adminRaleway } from '@/components/admin/adminFonts'
import type { AdminCustomerListItem } from '@/lib/admin/customers'

const countryOptions = ['All Countries', 'IN', 'US', 'GB', 'AU', 'CA']
const recentOptions = [
  'Recent Registered',
  'one week',
  'Two Week',
  'one Month',
  'Two Month',
  'Three Month',
]

function FilterDropdown({
  id, value, options, openId, onToggle, onSelect, className = '',
}: {
  id: string
  value: string
  options: string[]
  openId: string | null
  onToggle: (id: string) => void
  onSelect: (id: string, value: string) => void
  className?: string
}) {
  const isOpen = openId === id
  return (
    <div className={`group relative w-full ${className}`} data-filter-dropdown>
      <button
        type="button"
        className={`flex h-[38px] w-full items-center justify-between border border-gold/12 bg-footer px-3 text-left ${adminRaleway.className} text-[13px] font-light text-text-primary transition-colors duration-200 hover:border-gold/30`}
        aria-expanded={isOpen}
        onClick={() => onToggle(id)}
      >
        <span>{value}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={1.8}
        />
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

export default function AdminCustomersClient({
  customers,
  total,
  currentPage,
}: {
  customers: AdminCustomerListItem[]
  total: number
  currentPage: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [country, setCountry] = useState(searchParams.get('country') ?? 'All Countries')
  const [since, setSince] = useState(searchParams.get('since') ?? 'Recent Registered')

  const totalPages = Math.ceil(total / 20)
  const start = Math.min((currentPage - 1) * 20 + 1, total)
  const end = Math.min(currentPage * 20, total)

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
      if (v && v !== 'All Countries' && v !== 'Recent Registered') {
        params.set(k, v)
      } else {
        params.delete(k)
      }
    })
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleSelect(id: string, value: string) {
    if (id === 'countries') { setCountry(value); updateParams({ search, country: value, since }) }
    if (id === 'recent') { setSince(value); updateParams({ search, country, since: value }) }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateParams({ search, country, since })
  }

  return (
    <div className="space-y-5 animate-fadeInUp">
      <AdminPageHeading
        eyebrow="CUSTOMERS"
        title="Customers"
        subtitle={`${total.toLocaleString('en-IN')} registered customers`}
        action={
          <AdminOutlineButton
            label="EXPORT CSV"
            icon={<Download className="h-3.5 w-3.5" strokeWidth={1.8} />}
          />
        }
      />

      <section className="border border-gold/10 bg-[#1E1A2E] px-6 py-[18px]">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 lg:flex-row lg:flex-nowrap lg:items-center">
          <div className="flex-1">
            <AdminTextInput
              placeholder="Search by name, email..."
              className="w-full"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
          <FilterDropdown
            id="countries" value={country} options={countryOptions}
            openId={openDropdown}
            onToggle={(id) => setOpenDropdown((c) => c === id ? null : id)}
            onSelect={handleSelect}
            className="w-full sm:w-[160px]"
          />
          <FilterDropdown
            id="recent" value={since} options={recentOptions}
            openId={openDropdown}
            onToggle={(id) => setOpenDropdown((c) => c === id ? null : id)}
            onSelect={handleSelect}
            className="w-full sm:w-[180px]"
          />
        </form>
      </section>

      <section className="overflow-hidden border border-gold/10 bg-[#1E1A2E]">
        <div className="overflow-x-auto w-full">
          <div className="min-w-[1100px]">
            <div className={`grid grid-cols-[repeat(11,minmax(0,1fr))_79px_42px] bg-nav px-6 py-3 text-center ${adminCinzel.className} text-[10px] tracking-[0.18em] text-text-muted`}>
              {['NAME', 'USERNAME', 'REGISTERED', 'EMAIL', 'ORDERS', 'SPENT', 'LAST ORDER', 'AOV', 'COUNTRY', 'CITY', 'REGION', 'POSTAL', 'VIEW'].map((col) => (
                <div key={col} className="min-w-0 truncate font-semibold">{col}</div>
              ))}
            </div>

            {customers.length === 0 ? (
              <div className={`${adminRaleway.className} py-12 text-center text-[13px] text-text-muted`}>
                No customers found
              </div>
            ) : (
              customers.map((customer, index) => (
                <div
                  key={customer.id}
                  className={`card-hover grid grid-cols-[repeat(11,minmax(0,1fr))_79px_42px] px-6 py-3 text-center ${index < customers.length - 1 ? 'border-b border-gold/6' : ''}`}
                >
                  <div className={`${adminRaleway.className} min-w-0 truncate text-[13px] font-medium text-text-primary`}>{customer.name}</div>
                  <div className={`${adminRaleway.className} min-w-0 truncate text-[12px] font-light text-text-muted`}>{customer.username}</div>
                  <div className={`${adminRaleway.className} min-w-0 truncate text-[12px] font-light text-text-muted`}>{customer.registered}</div>
                  <div className={`${adminRaleway.className} min-w-0 truncate text-[12px] font-light text-text-muted`}>{customer.email}</div>
                  <div className={`${adminCinzel.className} min-w-0 truncate text-[13px] text-text-primary`}>{customer.orders}</div>
                  <div className={`${adminCinzel.className} min-w-0 truncate text-[13px] text-gold`}>{customer.spent}</div>
                  <div className={`${adminRaleway.className} min-w-0 truncate text-[12px] font-light text-text-muted`}>{customer.lastOrder}</div>
                  <div className={`${adminCinzel.className} min-w-0 truncate text-[13px] text-text-primary`}>{customer.aov}</div>
                  <div className={`${adminRaleway.className} min-w-0 truncate text-[12px] font-light text-text-muted`}>{customer.countryCode}</div>
                  <div className={`${adminRaleway.className} min-w-0 truncate text-[12px] font-light text-text-muted`}>{customer.city}</div>
                  <div className={`${adminRaleway.className} min-w-0 truncate text-[12px] font-light text-text-muted`}>{customer.region}</div>
                  <div className={`${adminRaleway.className} min-w-0 truncate text-[12px] font-light text-text-muted`}>{customer.postal}</div>
                  <div className="flex items-center justify-center">
                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="inline-flex text-gold transition-colors duration-200 hover:text-gold-hover"
                      aria-label={`View ${customer.name}`}
                    >
                      <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <AdminPagination
          summary={`Showing ${start}-${end} of ${total.toLocaleString('en-IN')} customers`}
          pages={totalPages <= 5
            ? Array.from({ length: totalPages }, (_, i) => i + 1)
            : [1, 2, 3, '...', totalPages]}
          currentPage={currentPage}
        />
      </section>
    </div>
  )
}