'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Pencil } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  AdminPagination,
  AdminPageHeading,
  AdminStatusBadge,
  AdminTextInput,
} from '@/components/admin/AdminUi'
import { adminCinzel, adminRaleway } from '@/components/admin/adminFonts'
import type { AdminProductListItem } from '@/lib/admin/products'

function CheckCell() {
  return <span className="inline-flex h-3 w-3 border border-text-muted/60" aria-hidden="true" />
}

function FilterDropdown({
  id, value, options, openId, onToggle, onSelect, className = '',
}: {
  id: string; value: string; options: string[]
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

export default function AdminProductsClient({
  products, total, activeCount, draftCount, currentPage,
}: {
  products: AdminProductListItem[]
  total: number
  activeCount: number
  draftCount: number
  currentPage: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [category, setCategory] = useState(searchParams.get('category') ?? 'All Categories')
  const [status, setStatus] = useState(searchParams.get('status') ?? 'All Status')
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'Newest First')
  const [allCategories, setAllCategories] = useState<string[]>(['All Categories', 'T-Shirts', 'Hoodies', 'Shirts', 'Pants', 'Jackets', 'Sets'])

  const totalPages = Math.ceil(total / 20)

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.ok ? res.json() : [])
      .then((cats) => {
        if (Array.isArray(cats) && cats.length > 0) {
          setAllCategories(['All Categories', ...cats.map((c: { name: string }) => c.name)])
        }
      })
      .catch(() => {})
  }, [])

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
      if (v && v !== 'All Categories' && v !== 'All Status' && v !== 'Newest First') {
        params.set(k, v)
      } else {
        params.delete(k)
      }
    })
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleSelect(id: string, value: string) {
    if (id === 'categories') { setCategory(value); updateParams({ search, category: value, status, sort }) }
    if (id === 'status') { setStatus(value); updateParams({ search, category, status: value, sort }) }
    if (id === 'sort') { setSort(value); updateParams({ search, category, status, sort: value }) }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateParams({ search, category, status, sort })
  }

  return (
    <div className="space-y-5 md:space-y-6 animate-fadeInUp">
      <AdminPageHeading
        eyebrow="CATALOGUE"
        title="Products"
        subtitle={`${total} products · ${activeCount} active · ${draftCount} draft`}
        action={
          <Link
            href="/admin/products/new"
            className={`${adminCinzel.className} inline-flex items-center justify-center bg-gold px-5 py-2.5 text-[10px] font-semibold tracking-[0.18em] text-nav transition-colors duration-200 hover:bg-gold-hover`}
          >
            + ADD PRODUCT
          </Link>
        }
      />

      <section className="border border-gold/10 bg-[#1E1A2E] px-6 py-[18px]">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 lg:flex-row lg:flex-nowrap lg:items-center">
          <div className="flex-1">
            <AdminTextInput
              placeholder="Search products by name, SKU..."
              className="w-full"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
          <FilterDropdown id="categories" value={category} options={allCategories} openId={openDropdown} onToggle={(id) => setOpenDropdown((c) => c === id ? null : id)} onSelect={handleSelect} className="w-full sm:w-[160px]" />
          <FilterDropdown id="status" value={status} options={['All Status', 'Active', 'Draft']} openId={openDropdown} onToggle={(id) => setOpenDropdown((c) => c === id ? null : id)} onSelect={handleSelect} className="w-full sm:w-[140px]" />
          <FilterDropdown id="sort" value={sort} options={['Newest First', 'A-z', 'z-A', 'price low to high', 'price high to low']} openId={openDropdown} onToggle={(id) => setOpenDropdown((c) => c === id ? null : id)} onSelect={handleSelect} className="w-full sm:w-[160px]" />
        </form>
      </section>

      <section className="overflow-hidden border border-gold/10 bg-[#1E1A2E]">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[900px] table-fixed border-collapse">
            <thead className="bg-nav">
              <tr className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-text-muted`}>
                <th className="w-[40px] px-6 py-3.5 text-center font-semibold"><CheckCell /></th>
                <th className="w-[76px] px-6 py-3.5 text-left font-semibold">IMAGE</th>
                <th className="w-[300px] px-6 py-3.5 text-left font-semibold">NAME</th>
                <th className="w-[120px] px-6 py-3.5 text-center font-semibold">CATEGORY</th>
                <th className="w-[140px] px-6 py-3.5 text-center font-semibold">PRICE</th>
                <th className="w-[100px] px-6 py-3.5 text-center font-semibold">STATUS</th>
                <th className="w-[120px] px-6 py-3.5 text-center font-semibold">DATE</th>
                <th className="w-[80px] px-6 py-3.5 text-center font-semibold">EDIT</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className={`${adminRaleway.className} py-12 text-center text-[13px] text-text-muted`}>
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-t border-gold/6">
                    <td className="px-6 py-3.5 text-center"><CheckCell /></td>
                    <td className="px-6 py-3.5">
                      <div className="relative h-12 w-12 overflow-hidden border border-gold/10 bg-nav">
                        <Image src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="space-y-1">
                        <p className={`${adminRaleway.className} text-[13px] font-medium text-text-primary`}>{product.name}</p>
                        <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>SKU: {product.sku}</p>
                      </div>
                    </td>
                    <td className={`${adminRaleway.className} px-6 py-3.5 text-center text-[13px] font-light text-text-muted`}>{product.category}</td>
                    <td className={`${adminCinzel.className} px-6 py-3.5 text-center text-[13px] text-text-primary`}>{product.price}</td>
                    <td className="px-6 py-3.5 text-center">
                      <AdminStatusBadge label={product.status.label} tone={product.status.tone} />
                    </td>
                    <td className={`${adminRaleway.className} px-6 py-3.5 text-center text-[12px] font-light text-text-muted`}>{product.date}</td>
                    <td className="px-6 py-3.5 text-center">
                      <Link href={`/admin/products/${product.id}`} className="inline-flex text-gold transition-colors duration-200 hover:text-gold-hover" aria-label={`Edit ${product.name}`}>
                        <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          summary={`Showing ${Math.min((currentPage - 1) * 20 + 1, total)}-${Math.min(currentPage * 20, total)} of ${total} products`}
          pages={totalPages <= 5
            ? Array.from({ length: totalPages }, (_, i) => i + 1)
            : [1, 2, 3, '...', totalPages]}
          currentPage={currentPage}
        />
      </section>
    </div>
  )
}