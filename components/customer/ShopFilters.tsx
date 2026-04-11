'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useState, useRef, useEffect } from 'react'
import StripedMarker from '@/components/customer/StripedMarker'

const COLOR_OPTIONS = ['Black', 'White', 'Grey', 'Navy', 'Brown', 'Olive']

const SORT_OPTIONS = [
  { value: 'newest', label: 'Recently Added' },
  { value: 'price_asc', label: 'Price Low to High' },
  { value: 'price_desc', label: 'Price High to Low' },
  { value: 'best_seller', label: 'Best Seller' },
  { value: 'name_asc', label: 'A-Z' },
]

const PRICE_OPTIONS = [
  { label: 'All Prices', min: undefined, max: undefined },
  { label: 'Under ₹1,000', min: undefined, max: 1000 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
  { label: 'Above ₹5,000', min: 5000, max: undefined },
]

// ── Dropdown wrapper with click outside to close ──────
function Dropdown({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-[34px] items-center gap-2 border px-3 font-sans text-[12px] transition-colors sm:h-10 sm:px-4 sm:text-[13px] ${
          open
            ? 'border-gold bg-gold text-nav'
            : 'border-gold bg-surface text-text-primary hover:text-gold'
        }`}
      >
        {label}
        <span className={`text-[10px] transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 border border-gold/20 bg-nav shadow-xl">
          {children}
        </div>
      )}
    </div>
  )
}

export default function ShopFilters({
  currentSort,
  currentColors,
  currentMinPrice,
  currentMaxPrice,
  total,
}: {
  currentSort: string
  currentColors: string[]
  currentMinPrice?: number
  currentMaxPrice?: number
  total: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  function handleColor(color: string) {
    const current = new Set(currentColors)
    if (current.has(color)) {
      current.delete(color)
    } else {
      current.add(color)
    }
    updateParams({
      colors: current.size > 0 ? [...current].join(',') : undefined,
    })
  }

  function handlePrice(min?: number, max?: number) {
    updateParams({
      minPrice: min?.toString(),
      maxPrice: max?.toString(),
    })
  }

  function handleSort(value: string) {
    updateParams({ sort: value })
  }

  const currentPriceLabel =
    PRICE_OPTIONS.find(
      (p) => p.min === currentMinPrice && p.max === currentMaxPrice
    )?.label ?? 'All Prices'

  const hasActiveFilters =
    currentColors.length > 0 || currentMinPrice !== undefined || currentMaxPrice !== undefined

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">

        {/* ── Color Filter ─────────────────── */}
        <Dropdown
          label={
            currentColors.length > 0
              ? `Color: ${currentColors.join(', ')}`
              : 'Color: All'
          }
        >
          <div className="p-3 min-w-[200px]">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-text-muted mb-2">
              Select Color
            </p>
            <div className="flex flex-col gap-1">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColor(color)}
                  className={`flex items-center gap-2 px-3 py-2 font-sans text-[13px] transition-colors text-left hover:bg-surface ${
                    currentColors.includes(color)
                      ? 'text-gold bg-surface'
                      : 'text-text-muted'
                  }`}
                >
                  <span
                    className={`h-3 w-3 rounded-full border flex-shrink-0 ${
                      currentColors.includes(color)
                        ? 'border-gold bg-gold'
                        : 'border-gold/30'
                    }`}
                  />
                  {color}
                  {currentColors.includes(color) && (
                    <span className="ml-auto text-gold text-[10px]">✓</span>
                  )}
                </button>
              ))}
            </div>
            {currentColors.length > 0 && (
              <button
                type="button"
                onClick={() => updateParams({ colors: undefined })}
                className="mt-2 w-full border-t border-gold/10 pt-2 font-sans text-[11px] text-[var(--status-error)] hover:opacity-80 text-left px-1"
              >
                Clear colors
              </button>
            )}
          </div>
        </Dropdown>

        {/* ── Price Filter ─────────────────── */}
        <Dropdown
          label={
            currentPriceLabel === 'All Prices'
              ? 'Price: All'
              : currentPriceLabel
          }
        >
          <div className="min-w-[200px]">
            {PRICE_OPTIONS.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => handlePrice(option.min, option.max)}
                className={`flex w-full items-center justify-between px-4 py-2.5 font-sans text-[13px] transition-colors hover:bg-surface ${
                  currentPriceLabel === option.label
                    ? 'text-gold bg-surface'
                    : 'text-text-muted'
                }`}
              >
                {option.label}
                {currentPriceLabel === option.label && (
                  <span className="text-gold text-[10px]">✓</span>
                )}
              </button>
            ))}
          </div>
        </Dropdown>

        {/* ── Clear All ────────────────────── */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() =>
              updateParams({
                colors: undefined,
                minPrice: undefined,
                maxPrice: undefined,
              })
            }
            className="flex h-[34px] items-center px-3 font-sans text-[12px] text-[var(--status-error)] border border-[var(--status-error)]/30 hover:border-[var(--status-error)] transition-colors sm:h-10"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <p className="hidden font-sans text-[12px] text-text-muted sm:block">
          {total} {total === 1 ? 'product' : 'products'}
        </p>

        {/* ── Sort Dropdown ────────────────── */}
        <div className="relative w-full sm:w-[220px] lg:w-[248px]">
          <select
            value={currentSort}
            onChange={(e) => handleSort(e.target.value)}
            aria-label="Sort products"
            className="h-[34px] w-full appearance-none border border-gold bg-surface px-3 pr-8 font-sans text-[12px] leading-none text-text-primary outline-none sm:h-10 sm:px-4 sm:pr-10 sm:text-[13px] cursor-pointer"
          >
            {SORT_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-surface text-text-primary"
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gold sm:right-4">
            <StripedMarker />
          </div>
        </div>
      </div>
    </div>
  )
}