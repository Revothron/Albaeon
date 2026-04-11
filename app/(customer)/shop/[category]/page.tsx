import { notFound } from 'next/navigation'
import ShopCollectionView from '@/components/customer/ShopCollectionView'
import { getProducts, getCategoryBySlug } from '@/lib/customer/products'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const cat = await getCategoryBySlug(category)
  if (!cat) return {}
  return {
    title: `${cat.name} — Albaeon`,
    description: `Shop Albaeon ${cat.name} — premium mythological designs.`,
  }
}

export default async function CategoryPage({
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

  const cat = await getCategoryBySlug(category)
  if (!cat) notFound()

  const sort = (sp.sort as 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'best_seller') ?? 'newest'
  const colors = sp.colors ? sp.colors.split(',') : []
  const minPrice = sp.minPrice ? Number(sp.minPrice) : undefined
  const maxPrice = sp.maxPrice ? Number(sp.maxPrice) : undefined
  const page = Number(sp.page ?? 1)

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