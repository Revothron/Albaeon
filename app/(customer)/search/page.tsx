'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Cinzel } from 'next/font/google'
import { createClient } from '@/lib/supabase/client'
import { useTrackingStore } from '@/store/trackingStore'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '600', '700'] })

// ── Types ─────────────────────────────────────────────
type CategoryShape = { name: string; slug: string }

type SearchResult = {
  id: string
  name: string
  slug: string
  price_inr: number
  price_usd: number | null
  product_images: { url: string; is_primary: boolean }[]
  categories: CategoryShape | CategoryShape[] | null
}

type RecommendedProduct = SearchResult & {
  reason: string
}

// ── Helpers ───────────────────────────────────────────
function getPrimaryImage(images: { url: string; is_primary: boolean }[]) {
  if (!images?.length) return '/placeholder.png'
  return images.find((i) => i.is_primary)?.url ?? images[0].url
}

function getCategory(
  categories: SearchResult['categories']
): CategoryShape | null {
  if (!categories) return null
  if (Array.isArray(categories)) return categories[0] ?? null
  return categories
}

function mapRow(row: unknown): SearchResult {
  const r = row as Record<string, unknown>
  return {
    id: r.id as string,
    name: r.name as string,
    slug: r.slug as string,
    price_inr: r.price_inr as number,
    price_usd: (r.price_usd as number | null) ?? null,
    product_images: (r.product_images as { url: string; is_primary: boolean }[]) ?? [],
    categories: (r.categories as CategoryShape | CategoryShape[] | null) ?? null,
  }
}

// ── Product Result Card ───────────────────────────────
function ProductResultCard({ product }: { product: SearchResult }) {
  const cat = getCategory(product.categories)
  return (
    <Link
      href={`/shop/product/${product.slug}`}
      className="group flex items-center gap-4 border border-gold/10 hover:border-gold/40 bg-surface p-3 transition-all duration-200"
    >
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden bg-primary-deep border border-gold/10">
        <Image
          src={getPrimaryImage(product.product_images)}
          alt={product.name}
          fill
          sizes="64px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <p className={`${cinzel.className} text-[13px] text-text-primary group-hover:text-gold transition-colors truncate`}>
          {product.name}
        </p>
        {cat && (
          <p className="font-sans text-[11px] text-text-muted uppercase tracking-[0.15em]">
            {cat.name}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 text-right">
        <p className={`${cinzel.className} text-[14px] text-gold`}>
          ₹{product.price_inr.toLocaleString('en-IN')}
        </p>
        {product.price_usd && (
          <p className="font-sans text-[11px] text-text-muted">
            ${product.price_usd}
          </p>
        )}
      </div>
    </Link>
  )
}

// ── Recommendation Card ───────────────────────────────
function RecommendationCard({ product }: { product: RecommendedProduct }) {
  return (
    <Link
      href={`/shop/product/${product.slug}`}
      className="group flex flex-col gap-3 border border-gold/10 hover:border-gold/30 bg-surface p-3 transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-primary-deep">
        <Image
          src={getPrimaryImage(product.product_images)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute bottom-2 left-2 bg-nav/80 px-2 py-0.5 font-sans text-[9px] uppercase tracking-[0.15em] text-gold">
          {product.reason}
        </span>
      </div>
      <div className="space-y-1 px-1">
        <p className={`${cinzel.className} text-[12px] text-text-primary group-hover:text-gold transition-colors sm:text-[14px]`}>
          {product.name}
        </p>
        <p className="font-sans text-[12px] font-semibold text-gold">
          ₹{product.price_inr.toLocaleString('en-IN')}
        </p>
      </div>
    </Link>
  )
}

// ── Skeleton Grid ─────────────────────────────────────
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="aspect-square bg-surface animate-pulse" />
      ))}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────
export default function SearchPage() {
  const supabase = createClient()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([])
  const [recsLoading, setRecsLoading] = useState(true)
  const [isPersonalised, setIsPersonalised] = useState(false)

  const viewedProducts = useTrackingStore((s) => s.viewedProducts)
  const searchHistory = useTrackingStore((s) => s.searchHistory)
  const trackSearch = useTrackingStore((s) => s.trackSearch)
  const clearHistory = useTrackingStore((s) => s.clearHistory)

  const PRODUCT_SELECT = `
    id, name, slug, price_inr, price_usd,
    product_images (url, is_primary),
    categories (name, slug)
  `

  // ── Load recommendations ──────────────────────────────
  useEffect(() => {
    async function loadRecommendations() {

      // ── Step 1: Load defaults immediately ────────────
      const { data: defaults } = await supabase
        .from('products')
        .select(PRODUCT_SELECT)
        .eq('status', 'active')
        .or('is_new_arrival.eq.true,is_best_seller.eq.true')
        .order('created_at', { ascending: false })
        .limit(8)

      if (defaults && defaults.length > 0) {
        setRecommendations(
          defaults.map((p) => ({
            ...mapRow(p),
            reason: (p as Record<string, unknown>).is_new_arrival
              ? 'New arrival'
              : 'Best seller',
          }))
        )
        setRecsLoading(false)
      }

      // ── Step 2: Build personal recs in background ────
      const recs: RecommendedProduct[] = []
      const usedIds = new Set<string>()

      // Purchase history
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: orderItems } = await supabase
            .from('order_items')
            .select(`
              product_id,
              products (
                id, name, slug, price_inr, price_usd,
                product_images (url, is_primary),
                categories (name, slug)
              )
            `)
            .limit(3)

          if (orderItems) {
            for (const item of orderItems) {
              const p = item.products
              if (p && !Array.isArray(p)) {
                const mapped = mapRow(p)
                if (!usedIds.has(mapped.id)) {
                  usedIds.add(mapped.id)
                  recs.push({ ...mapped, reason: 'Purchased' })
                }
              }
            }
          }

          if (recs.length > 0 && usedIds.size > 0) {
            const { data: related } = await supabase
              .from('products')
              .select(PRODUCT_SELECT)
              .eq('status', 'active')
              .not('id', 'in', `(${[...usedIds].join(',')})`)
              .limit(3)

            if (related) {
              for (const p of related) {
                const mapped = mapRow(p)
                if (!usedIds.has(mapped.id)) {
                  usedIds.add(mapped.id)
                  recs.push({ ...mapped, reason: 'Based on purchases' })
                }
              }
            }
          }
        }
      } catch {
        // Not logged in
      }

      // Recently viewed
      for (const viewed of viewedProducts.slice(0, 4)) {
        if (!usedIds.has(viewed.id)) {
          usedIds.add(viewed.id)
          recs.push({
            id: viewed.id,
            slug: viewed.slug,
            name: viewed.name,
            price_inr: viewed.price_inr,
            price_usd: null,
            product_images: [{ url: viewed.image, is_primary: true }],
            categories: null,
            reason: 'Recently viewed',
          })
        }
      }

      // Search history
      for (const s of searchHistory.slice(0, 3)) {
        const { data } = await supabase
          .from('products')
          .select(PRODUCT_SELECT)
          .eq('status', 'active')
          .ilike('name', `%${s.term}%`)
          .limit(2)

        if (data) {
          for (const p of data) {
            const mapped = mapRow(p)
            if (!usedIds.has(mapped.id)) {
              usedIds.add(mapped.id)
              recs.push({ ...mapped, reason: `From "${s.term}"` })
            }
          }
        }
      }

      // ── Step 3: Swap to personal only if enough ──────
      if (recs.length >= 3) {
        if (recs.length < 8) {
          const excludeClause = usedIds.size > 0
            ? `(${[...usedIds].join(',')})`
            : '(00000000-0000-0000-0000-000000000000)'

          const { data: fill } = await supabase
            .from('products')
            .select(PRODUCT_SELECT)
            .eq('status', 'active')
            .eq('is_new_arrival', true)
            .not('id', 'in', excludeClause)
            .limit(8 - recs.length)

          if (fill) {
            for (const p of fill) {
              const mapped = mapRow(p)
              if (!usedIds.has(mapped.id)) {
                recs.push({ ...mapped, reason: 'New arrival' })
              }
            }
          }
        }

        setRecommendations(recs.slice(0, 8))
        setIsPersonalised(true)
      }
      // else: keep defaults showing
    }

    loadRecommendations()
  }, [viewedProducts.length, searchHistory.length])

  // ── Search ────────────────────────────────────────────
  const search = useCallback(
    async (q: string) => {
      if (q.trim().length < 2) {
        setResults([])
        setSearched(false)
        return
      }

      setLoading(true)
      setSearched(true)

      const { data } = await supabase
        .from('products')
        .select(PRODUCT_SELECT)
        .eq('status', 'active')
        .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
        .order('is_best_seller', { ascending: false })
        .limit(20)

      setResults((data ?? []).map(mapRow))
      setLoading(false)
    },
    [supabase]
  )

  // Debounce 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) trackSearch(query.trim())
      search(query)
    }, 350)
    return () => clearTimeout(timer)
  }, [query, search, trackSearch])

  return (
    <div
      className="animate-fadeInUp"
      style={{
        minHeight: '70vh',
        padding: 'clamp(48px, 8vw, 80px) clamp(16px, 4vw, 56px)',
        maxWidth: '860px',
        margin: '0 auto',
      }}
    >
      {/* ── Header ─────────────────────── */}
      <p style={{
        fontFamily: 'inherit',
        fontSize: '9px',
        fontWeight: 700,
        letterSpacing: '6px',
        textTransform: 'uppercase',
        color: 'var(--albaeon-gold, #E6C979)',
        marginBottom: '16px',
      }}>
        Search
      </p>

      {/* ── Input ──────────────────────── */}
      <div style={{ position: 'relative', marginBottom: '32px' }}>
        <input
          type="search"
          placeholder="Search products, collections..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          style={{
            width: '100%',
            height: '52px',
            background: 'var(--albaeon-surface, #2C2040)',
            border: '1px solid rgba(230,201,121,0.20)',
            color: 'var(--albaeon-text-primary, #E8E2D6)',
            padding: '0 52px 0 20px',
            fontSize: '15px',
            fontFamily: 'inherit',
            fontWeight: 300,
            letterSpacing: '0.5px',
            outline: 'none',
          }}
        />
        <span style={{
          position: 'absolute',
          right: '18px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: loading
            ? 'var(--albaeon-gold, #E6C979)'
            : 'var(--albaeon-text-muted, #B7AFC3)',
          fontSize: '18px',
          pointerEvents: 'none',
          transition: 'color 0.2s',
        }}>
          {loading ? '...' : '⌕'}
        </span>
      </div>

      {/* ── Short query hint ───────────── */}
      {query.length === 1 && (
        <p className="font-sans text-[13px] text-text-muted leading-[1.8]">
          Keep typing to search...
        </p>
      )}

      {/* ── Search Results ─────────────── */}
      {query.length >= 2 && (
        <div className="space-y-3 mb-10">
          <div className="flex items-center justify-between">
            <p className="font-sans text-[11px] text-text-muted">
              {searched && !loading && (
                results.length > 0 ? (
                  <>
                    {results.length} result{results.length !== 1 ? 's' : ''} for{' '}
                    <span className="text-gold">&ldquo;{query}&rdquo;</span>
                  </>
                ) : (
                  <>
                    No results for{' '}
                    <span className="text-gold">&ldquo;{query}&rdquo;</span>
                  </>
                )
              )}
            </p>
            {results.length > 0 && (
              <Link
                href="/shop"
                className="font-sans text-[11px] text-gold hover:text-gold-hover transition-colors"
              >
                View all →
              </Link>
            )}
          </div>

          {results.length > 0 && (
            <div className="flex flex-col gap-2">
              {results.map((product) => (
                <ProductResultCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {searched && !loading && results.length === 0 && (
            <div className="flex flex-col gap-4 border border-gold/10 bg-surface p-8 text-center">
              <p className={`${cinzel.className} text-[20px] text-text-muted`}>
                No products found
              </p>
              <p className="font-sans text-[13px] text-text-muted leading-[1.7]">
                Try a different search term or browse our collections.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/shop" className="btn-primary">Browse All</Link>
                <Link href="/shop/t-shirts" className="btn-secondary">T-Shirts</Link>
                <Link href="/shop/hoodies" className="btn-secondary">Hoodies</Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Empty State with Recommendations ── */}
      {query.length === 0 && (
        <div className="space-y-8">

          {/* Recent searches */}
          {searchHistory.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className={`${cinzel.className} text-[10px] font-bold tracking-[0.3em] text-gold`}>
                  RECENT SEARCHES
                </p>
                <button
                  type="button"
                  onClick={clearHistory}
                  className="font-sans text-[11px] text-text-muted hover:text-gold transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 6).map((s) => (
                  <button
                    key={s.term}
                    type="button"
                    onClick={() => setQuery(s.term)}
                    className="flex items-center gap-2 border border-gold/15 bg-surface px-3 py-1.5 font-sans text-[12px] text-text-muted hover:border-gold hover:text-gold transition-colors"
                  >
                    ⌕ {s.term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recently viewed */}
          {viewedProducts.length > 0 && (
            <div className="space-y-3">
              <p className={`${cinzel.className} text-[10px] font-bold tracking-[0.3em] text-gold`}>
                RECENTLY VIEWED
              </p>
              <div className="flex flex-col gap-2">
                {viewedProducts.slice(0, 4).map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/product/${product.slug}`}
                    className="group flex items-center gap-4 border border-gold/10 hover:border-gold/40 bg-surface p-3 transition-all duration-200"
                  >
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden bg-primary-deep border border-gold/10">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <p className={`${cinzel.className} flex-1 text-[13px] text-text-primary group-hover:text-gold transition-colors truncate`}>
                      {product.name}
                    </p>
                    <p className={`${cinzel.className} flex-shrink-0 text-[13px] text-gold`}>
                      ₹{product.price_inr.toLocaleString('en-IN')}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className={`${cinzel.className} text-[10px] font-bold tracking-[0.3em] text-gold`}>
                RECOMMENDED FOR YOU
              </p>
              <p className="font-sans text-[10px] text-text-muted">
                {isPersonalised
                  ? 'Based on your activity'
                  : 'Popular picks'}
              </p>
            </div>

            {recsLoading ? (
              <SkeletonGrid />
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {recommendations.map((product) => (
                  <RecommendationCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="font-sans text-[13px] text-text-muted">
                Browse products to get personalised recommendations.
              </p>
            )}
          </div>

        </div>
      )}
    </div>
  )
}