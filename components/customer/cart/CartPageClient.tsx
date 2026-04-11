'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Cinzel } from 'next/font/google'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { useTrackingStore } from '@/store/trackingStore'
import { createClient } from '@/lib/supabase/client'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

type CartRec = {
  id: string
  name: string
  slug: string
  price_inr: number
  image: string
  reason: string
}

export default function CartPageClient() {
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const subtotal = useCartStore((s) => s.subtotal())
  const addToast = useUiStore((s) => s.addToast)

  const supabase = createClient()
  const viewedProducts = useTrackingStore((s) => s.viewedProducts)
  const searchHistory = useTrackingStore((s) => s.searchHistory)
  const cartProductIds = items.map((i) => i.productId)

  const [cartRecs, setCartRecs] = useState<CartRec[]>([])
  const [mounted, setMounted] = useState(false)

  // ── Wait for store to hydrate ─────────────────────────
  useEffect(() => {
    setMounted(true)
  }, [])

  // ── Load recommendations ──────────────────────────────
  useEffect(() => {
    if (!mounted) return

    async function loadCartRecs() {
      const recs: CartRec[] = []
      const usedIds = new Set<string>([...cartProductIds])
      const SELECT = `id, name, slug, price_inr, product_images (url, is_primary)`

      function getImage(
        product_images: { url: string; is_primary: boolean }[]
      ) {
        return (
          product_images?.find((i) => i.is_primary)?.url ??
          product_images?.[0]?.url ??
          '/placeholder.png'
        )
      }

      // 1. Recently viewed — not in cart
      for (const v of viewedProducts.slice(0, 4)) {
        if (!usedIds.has(v.id)) {
          usedIds.add(v.id)
          recs.push({
            id: v.id,
            name: v.name,
            slug: v.slug,
            price_inr: v.price_inr,
            image: v.image,
            reason: 'Recently viewed',
          })
        }
      }

      // 2. From search history
      for (const s of searchHistory.slice(0, 2)) {
        const { data } = await supabase
          .from('products')
          .select(SELECT)
          .eq('status', 'active')
          .ilike('name', `%${s.term}%`)
          .limit(2)

        if (data) {
          for (const p of data) {
            if (!usedIds.has(p.id)) {
              usedIds.add(p.id)
              recs.push({
                id: p.id,
                name: p.name,
                slug: p.slug,
                price_inr: p.price_inr,
                image: getImage(
                  p.product_images as { url: string; is_primary: boolean }[]
                ),
                reason: `From "${s.term}"`,
              })
            }
          }
        }
      }

      // 3. Fill with new arrivals if less than 3
      if (recs.length < 3) {
        const excludeClause =
          usedIds.size > 0
            ? `(${[...usedIds].join(',')})`
            : '(00000000-0000-0000-0000-000000000000)'

        const { data } = await supabase
          .from('products')
          .select(SELECT)
          .eq('status', 'active')
          .eq('is_new_arrival', true)
          .not('id', 'in', excludeClause)
          .limit(3 - recs.length)

        if (data) {
          for (const p of data) {
            recs.push({
              id: p.id,
              name: p.name,
              slug: p.slug,
              price_inr: p.price_inr,
              image: getImage(
                p.product_images as { url: string; is_primary: boolean }[]
              ),
              reason: 'New arrival',
            })
          }
        }
      }

      // 4. If still empty fall back to best sellers
      if (recs.length === 0) {
        const { data } = await supabase
          .from('products')
          .select(SELECT)
          .eq('status', 'active')
          .eq('is_best_seller', true)
          .limit(3)

        if (data) {
          for (const p of data) {
            recs.push({
              id: p.id,
              name: p.name,
              slug: p.slug,
              price_inr: p.price_inr,
              image: getImage(
                p.product_images as { url: string; is_primary: boolean }[]
              ),
              reason: 'Best seller',
            })
          }
        }
      }

      setCartRecs(recs.slice(0, 3))
    }

    loadCartRecs()
  }, [mounted, viewedProducts.length, searchHistory.length, cartProductIds.join(',')])

  // ── Empty cart ────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div
        className="animate-fadeInUp"
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '80px 20px',
        }}
      >
        <p
          style={{
            fontFamily: 'inherit',
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 300,
            color: 'var(--albaeon-text-muted, #B7AFC3)',
            marginBottom: '12px',
          }}
        >
          Your cart is empty.
        </p>
        <p
          style={{
            fontFamily: 'inherit',
            fontSize: '14px',
            fontWeight: 300,
            color: 'var(--albaeon-text-muted, #B7AFC3)',
            marginBottom: '32px',
            lineHeight: 1.7,
            maxWidth: '320px',
          }}
        >
          Add something worthy of the myth.
        </p>
        <a href="/shop" className="btn-primary">
          Shop Collection
        </a>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-primary animate-fadeInUp">
      <div className="desktop-frame flex flex-col gap-7 py-6 sm:py-8 lg:gap-7 lg:py-12">
        <h1
          className={`${cinzel.className} text-[32px] font-normal text-gold sm:text-[44px] lg:text-[52px]`}
        >
          Your Cart
        </h1>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

          {/* ── Cart Items ─────────────────── */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="flex flex-col gap-4 border border-gold bg-surface p-4 sm:flex-row sm:gap-6 card-hover"
              >
                <div className="relative h-[200px] w-full overflow-hidden border border-gold bg-primary-deep sm:w-[180px]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 180px"
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col gap-2.5">
                  <p
                    className={`${cinzel.className} text-[22px] text-text-primary sm:text-[26px] lg:text-[28px]`}
                  >
                    {item.name}
                  </p>
                  <p className="font-sans text-[13px] text-text-muted sm:text-[14px]">
                    {`Size: ${item.size || '—'}   Color: ${item.color || '—'}`}
                  </p>
                  <p className="font-sans text-[13px] font-semibold text-gold">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity - 1)
                      }
                      className="flex h-7 w-7 items-center justify-center border border-gold/30 text-text-primary hover:border-gold hover:text-gold transition-colors"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-sans text-[14px] text-text-primary">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity + 1)
                      }
                      className="flex h-7 w-7 items-center justify-center border border-gold/30 text-text-primary hover:border-gold hover:text-gold transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <button
                      type="button"
                      className="font-sans text-[13px] text-gold transition-colors duration-200 hover:text-gold-hover sm:text-[14px]"
                      onClick={() => {
                        removeItem(item.variantId)
                        addToast({
                          message: 'Item removed from cart',
                          type: 'info',
                        })
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Order Summary ──────────────── */}
          <div className="h-fit border border-gold bg-surface p-5 sm:p-6">
            <h2
              className={`${cinzel.className} text-[26px] text-gold sm:text-[30px] lg:text-[32px]`}
            >
              Order Summary
            </h2>

            <div className="mt-4 space-y-2 font-sans text-[14px]">
              <div className="flex justify-between text-text-muted">
                <span>
                  Subtotal ({items.length}{' '}
                  {items.length === 1 ? 'item' : 'items'})
                </span>
                <span className="text-text-primary">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Shipping</span>
                <span className="text-[var(--status-success)]">Free</span>
              </div>
              <div className="my-3 h-px w-full bg-gold/10" />
              <div className="flex justify-between font-semibold">
                <span className="text-text-primary">Total</span>
                <span className="text-[16px] text-gold">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Link
              href="/checkout/delivery"
              className="mt-4 flex h-[52px] items-center justify-center bg-gold font-sans text-[15px] font-bold text-nav transition-colors duration-200 hover:bg-gold-hover"
            >
              Checkout
            </Link>
          </div>
        </div>

        {/* ── Recommended ────────────────── */}
        {cartRecs.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2
                className={`${cinzel.className} text-[28px] text-gold sm:text-[34px] lg:text-[40px]`}
              >
                You May Also Like
              </h2>
              <p className="hidden font-sans text-[12px] text-text-muted sm:block">
                {viewedProducts.length > 0 || searchHistory.length > 0
                  ? 'Based on your activity'
                  : 'Popular picks'}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {cartRecs.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/product/${product.slug}`}
                  className="group flex flex-col gap-3.5 border border-gold bg-surface p-3.5 transition-colors hover:border-gold-hover"
                >
                  <div className="relative h-[320px] w-full overflow-hidden bg-primary-deep">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 308px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <span className="absolute bottom-2 left-2 bg-nav/80 px-2 py-0.5 font-sans text-[9px] uppercase tracking-[0.15em] text-gold">
                      {product.reason}
                    </span>
                  </div>
                  <p
                    className={`${cinzel.className} text-[20px] text-text-primary sm:text-[22px] lg:text-[24px]`}
                  >
                    {product.name}
                  </p>
                  <p className="font-sans text-[16px] font-semibold text-gold sm:text-[18px]">
                    ₹{product.price_inr.toLocaleString('en-IN')}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}