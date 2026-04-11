export const dynamic = 'force-dynamic'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import WishlistPageClient from '@/components/customer/WishlistPageClient'

type WishlistProduct = {
  id: string
  name: string
  slug: string
  price_inr: number
  price_usd: number | null
  product_images: { url: string; is_primary: boolean }[]
}

async function fetchProductsByIds(ids: string[]): Promise<WishlistProduct[]> {
  if (ids.length === 0) return []

  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price_inr,
      price_usd,
      product_images (url, is_primary)
    `)
    .in('id', ids)
    .eq('status', 'active')

  return (data ?? []) as WishlistProduct[]
}

export default async function WishlistPage() {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const { data: { user } } = await supabase.auth.getUser()

  let products: WishlistProduct[] = []

  if (user) {
    // Logged-in — fetch from Supabase wishlists table
    const { data: wishlistItems } = await supabase
      .from('wishlists')
      .select(`
        product_id,
        products (
          id,
          name,
          slug,
          price_inr,
          price_usd,
          product_images (url, is_primary)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    products = (wishlistItems ?? [])
      .map((w) => w.products)
      .filter(Boolean) as WishlistProduct[]
  } else {
    // Guest — read IDs from cookie, fetch products
    const wishlistCookie = cookieStore.get('albaeon-wishlist')?.value
    if (wishlistCookie) {
      try {
        const ids: string[] = JSON.parse(wishlistCookie)
        products = await fetchProductsByIds(ids)
      } catch {
        products = []
      }
    }
  }

  return (
    <WishlistPageClient
      products={products}
      isLoggedIn={!!user}
    />
  )
}