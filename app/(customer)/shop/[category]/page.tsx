import { notFound } from 'next/navigation'
import ShopCollectionView from '@/components/customer/ShopCollectionView'
import {
  getProducts,
  getCategoryBySlug,
  getCollectionBySlug,
} from '@/lib/customer/products'
import type { Metadata } from 'next'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://albaeon.com'

  const cat = await getCategoryBySlug(category)
  if (cat) {
    const title = cat.name
    const description = `Shop the ${cat.name} collection at Albaeon — mythology-inspired premium streetwear.`
    const url = `${siteUrl}/shop/${cat.slug}`
    const ogImage = cat.image_url ?? '/og-default.jpg'
    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title: `${title} | Albaeon`,
        description,
        url,
        images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | Albaeon`,
        description,
        images: [ogImage],
      },
    }
  }

  const collection = await getCollectionBySlug(category)
  if (collection) {
    return {
      title: collection.name,
      description: `Browse the ${collection.name} collection at Albaeon — mythology-inspired apparel for those who wear meaning.`,
      alternates: {
        canonical: `${siteUrl}/shop/${collection.slug}`,
      },
      openGraph: {
        title: `${collection.name} | Albaeon`,
        description: `Browse the ${collection.name} collection — mythology-inspired apparel.`,
        url: `${siteUrl}/shop/${collection.slug}`,
        images: [{ url: '/og-default.jpg', width: 800, height: 600, alt: `${collection.name} - Albaeon Shop` }],
      },
    }
  }

  return {}
}

export default async function ShopDynamicPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<{
    sort?: string
    colors?: string
    minPrice?: string
    maxPrice?: string
    page?: string
  }>
}) {
  const { category } = await params
  const sp = await searchParams

  const sort = (sp.sort as 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'best_seller') ?? 'newest'
  const colors = sp.colors ? sp.colors.split(',') : []
  const minPrice = sp.minPrice ? Number(sp.minPrice) : undefined
  const maxPrice = sp.maxPrice ? Number(sp.maxPrice) : undefined
  const page = Number(sp.page ?? 1)

  const cat = await getCategoryBySlug(category)
  if (cat) {
    const { products, total } = await getProducts({
      categorySlug: category,
      sort,
      colors,
      minPrice,
      maxPrice,
      limit: 24,
      page,
    })

    return (
      <ShopCollectionView
        heading={cat.name}
        description={`Shop Albaeon ${cat.name} — premium mythological designs.`}
        products={products}
        total={total}
        currentSort={sort}
        currentColors={colors}
        currentMinPrice={minPrice}
        currentMaxPrice={maxPrice}
      />
    )
  }

  const collection = await getCollectionBySlug(category)
  if (collection) {
    const { products, total } = await getProducts({
      collectionId: collection.id,
      sort,
      colors,
      minPrice,
      maxPrice,
      limit: 24,
      page,
    })

    return (
      <ShopCollectionView
        heading={collection.name}
        description={`Browse our ${collection.name.toLowerCase()} — mythology-inspired apparel for those who wear meaning.`}
        products={products}
        total={total}
        currentSort={sort}
        currentColors={colors}
        currentMinPrice={minPrice}
        currentMaxPrice={maxPrice}
      />
    )
  }

  notFound()
}
