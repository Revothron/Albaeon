'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Cinzel } from 'next/font/google'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { useUiStore } from '@/store/uiStore'
import { useRouter } from 'next/navigation'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

type WishlistProduct = {
  id: string
  name: string
  slug: string
  price_inr: number
  price_usd: number | null
  product_images: { url: string; is_primary: boolean }[]
}

function getPrimaryImage(images: { url: string; is_primary: boolean }[]) {
  if (!images?.length) return '/placeholder.png'
  return images.find((i) => i.is_primary)?.url ?? images[0].url
}

function EmptyState() {
  return (
    <div
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
      <p style={{
        fontFamily: 'inherit',
        fontSize: 'clamp(24px, 4vw, 32px)',
        fontWeight: 300,
        color: 'var(--albaeon-text-muted, #B7AFC3)',
        marginBottom: '12px',
      }}>
        Nothing saved yet.
      </p>
      <p style={{
        fontFamily: 'inherit',
        fontSize: '14px',
        fontWeight: 300,
        color: 'var(--albaeon-text-muted, #B7AFC3)',
        marginBottom: '32px',
        lineHeight: 1.7,
        maxWidth: '320px',
      }}>
        Save pieces that speak to you.
      </p>
      <a href="/shop" className="btn-primary">Browse Products</a>
    </div>
  )
}

export default function WishlistPageClient({
  products,
  isLoggedIn,
}: {
  products: WishlistProduct[]
  isLoggedIn: boolean
}) {
  const removeItem = useWishlistStore((s) => s.removeItem)
  const addItem = useCartStore((s) => s.addItem)
  const addToast = useUiStore((s) => s.addToast)
  const router = useRouter()

  if (products.length === 0) return <EmptyState />

  function handleAddToCart(product: WishlistProduct) {
    addItem({
      id: Date.now().toString(),
      variantId: `${product.id}-M`,
      productId: product.id,
      name: product.name,
      sku: product.slug,
      color: '',
      size: 'M',
      price: product.price_inr,
      currency: 'INR',
      image: getPrimaryImage(product.product_images),
      quantity: 1,
    })
    addToast({ message: `${product.name} added to cart`, type: 'success' })
  }

  function handleRemove(productId: string) {
    removeItem(productId)
    addToast({ message: 'Removed from wishlist', type: 'info' })
    router.refresh()
  }

  return (
    <section className="min-h-screen bg-primary animate-fadeInUp">
      <div className="desktop-frame flex flex-col gap-7 py-6 sm:py-8 lg:gap-7 lg:py-12">
        <div className="flex items-center justify-between">
          <h1 className={`${cinzel.className} text-[32px] font-normal text-gold sm:text-[44px] lg:text-[52px]`}>
            Wishlist
          </h1>
          <div className="flex items-center gap-4">
            <p className="font-sans text-[13px] text-text-muted">
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </p>
            {/* Prompt guest users to sign in to save across devices */}
            {!isLoggedIn && (
              <Link
                href="/login"
                className="font-sans text-[12px] text-gold hover:text-gold-hover transition-colors"
              >
                Sign in to save across devices →
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col gap-3 border border-gold/10 hover:border-gold/30 bg-surface p-3 transition-all duration-300"
            >
              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(product.id)}
                aria-label="Remove from wishlist"
                className="absolute right-3 top-3 z-10 text-gold transition-transform hover:scale-110"
              >
                <Heart className="h-5 w-5 fill-current" />
              </button>

              {/* Image */}
              <Link href={`/shop/product/${product.slug}`}>
                <div className="relative aspect-square overflow-hidden bg-primary-deep">
                  <Image
                    src={getPrimaryImage(product.product_images)}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              </Link>

              {/* Info */}
              <div className="space-y-1 px-1">
                <Link href={`/shop/product/${product.slug}`}>
                  <h3 className={`${cinzel.className} text-[13px] text-text-primary hover:text-gold transition-colors sm:text-[15px]`}>
                    {product.name}
                  </h3>
                </Link>
                <p className="font-sans text-[12px] font-semibold text-gold sm:text-[14px]">
                  ₹{product.price_inr.toLocaleString('en-IN')}
                  {product.price_usd && (
                    <span className="ml-2 text-text-muted text-[11px]">
                      (${product.price_usd})
                    </span>
                  )}
                </p>
              </div>

              {/* Add to cart */}
              <button
                type="button"
                onClick={() => handleAddToCart(product)}
                className="btn-primary w-full text-[10px] py-2"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}