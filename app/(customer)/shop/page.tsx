import type { Metadata } from 'next'
import ShopCollectionView from '@/components/customer/ShopCollectionView'
import { getProducts } from '@/lib/customer/products'

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Shop All',
  description: 'Browse the full Albaeon collection — mythology-inspired apparel for those who wear meaning. Filter by category, new arrivals, and bestsellers.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://albaeon.com'}/shop`,
  },
  openGraph: {
    title: 'Shop All | Albaeon',
    description: 'Browse the full Albaeon collection — mythology-inspired apparel.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://albaeon.com'}/shop`,
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Albaeon Shop' }],
  },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    view?: string
    sort?: string
    colors?: string
    minPrice?: string
    maxPrice?: string
    page?: string
  }>
}) {
  const params = await searchParams
  const view = params.view
  const collectionRule = view === 'new-arrivals' ? 'new_arrivals'
    : view === 'best-sellers' ? 'best_sellers'
    : view === 'limited-drops' ? 'limited_drops'
    : undefined
  const sort = (params.sort as 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'best_seller') ?? 'newest'
  const colors = params.colors ? params.colors.split(',') : []
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined
  const page = Number(params.page ?? 1)

  const { products, total } = await getProducts({
    collectionRule,
    sort,
    colors,
    minPrice,
    maxPrice,
    limit: 24,
    page,
  })

  const heading = view === 'new-arrivals' ? 'New Arrivals'
    : view === 'best-sellers' ? 'Best Sellers'
    : view === 'limited-drops' ? 'Limited Drops'
    : 'Collection'

  return (
    <ShopCollectionView
      heading={heading}
      description={`Browse our ${heading.toLowerCase()} — mythology-inspired apparel for those who wear meaning.`}
      products={products}
      total={total}
      currentSort={sort}
      currentColors={colors}
      currentMinPrice={minPrice}
      currentMaxPrice={maxPrice}
    />
  )
}