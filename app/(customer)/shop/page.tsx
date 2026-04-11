import ShopCollectionView from '@/components/customer/ShopCollectionView'
import { getProducts } from '@/lib/customer/products'

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    sort?: string
    colors?: string
    minPrice?: string
    maxPrice?: string
    page?: string
  }>
}) {
  const params = await searchParams
  const sort = (params.sort as 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'best_seller') ?? 'newest'
  const colors = params.colors ? params.colors.split(',') : []
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined
  const page = Number(params.page ?? 1)

  const { products, total } = await getProducts({
    sort,
    colors,
    minPrice,
    maxPrice,
    limit: 24,
    page,
  })

  return (
    <ShopCollectionView
      heading="Collection"
      description="Curated mythic essentials for an international wardrobe."
      products={products}
      total={total}
      currentSort={sort}
      currentColors={colors}
      currentMinPrice={minPrice}
      currentMaxPrice={maxPrice}
    />
  )
}