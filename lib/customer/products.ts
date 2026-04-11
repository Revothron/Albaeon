import { createClient } from '@/lib/supabase/server'

// ── Types ─────────────────────────────────────────────────────────────────────
export type ProductHighlight = {
  label: string
  value: string
}

export const productCategories = [
  { slug: 't-shirts', label: 'T-Shirts' },
  { slug: 'hoodies', label: 'Hoodies' },
  { slug: 'shirts', label: 'Shirts' },
  { slug: 'pants', label: 'Pants' },
  { slug: 'jackets', label: 'Jackets' },
  { slug: 'sets', label: 'Sets' },
] as const

export type ProductCategorySlug = (typeof productCategories)[number]['slug']

export type Product = {
  id: string
  slug: string
  name: string
  category: string
  price: string
  priceINR: number
  priceUSD: number | null
  image: string
  gallery: string[]
  images: string[]
  sizes: string[]
  defaultSize: string
  variants: {
    id: string
    size: string
    color: string
    color_hex: string | null
    sku: string
    stock_status: string
  }[]
  description: string
  sizeChart: string
  washCare: string
  returnPolicy: string
  highlights: ProductHighlight[]
  is_new_arrival: boolean
  is_best_seller: boolean
}

// ── Constants ─────────────────────────────────────────────────────────────────
const DEFAULT_RETURN_POLICY =
  'Returns and exchanges accepted within 14 days on unworn items with original tags. Refunds are processed after inspection.'

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

// ── Supabase row type ─────────────────────────────────────────────────────────
type ProductRow = {
  id: string
  name: string
  slug: string
  price_inr: number
  price_usd: number | null
  description: string | null
  wash_care: string | null
  size_chart: { text?: string } | string | null
  highlights: { key: string; value: string }[] | null
  is_new_arrival: boolean
  is_best_seller: boolean
  categories: { slug: string; name: string } | null
  product_images: {
    url: string
    is_primary: boolean
    sort_order: number
  }[]
  product_variants: {
    id?: string
    size: string
    color?: string
    color_hex?: string | null
    sku?: string
    stock_status: string
    sort_order: number
  }[]
}

// ── Map Supabase row → Product shape ──────────────────────────────────────────
function mapProduct(row: ProductRow): Product {
  // Sort images — primary first
  const sortedImages = [...(row.product_images ?? [])].sort(
    (a, b) =>
      (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) ||
      a.sort_order - b.sort_order
  )

  const gallery = sortedImages.map((img) => img.url)
  const image = gallery[0] ?? '/placeholder.png'

  // Available sizes from in_stock variants only
  const rawSizes = [
    ...new Set(
      (row.product_variants ?? [])
        .filter((v) => v.stock_status === 'in_stock')
        .map((v) => v.size)
    ),
  ].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b))

  const sizes = rawSizes.length > 0 ? rawSizes : ['S', 'M', 'L', 'XL']
  const defaultSize = sizes.includes('M') ? 'M' : sizes[0]

  // Size chart text
  const sizeChartText =
    typeof row.size_chart === 'string'
      ? row.size_chart
      : typeof row.size_chart === 'object' && row.size_chart?.text
        ? row.size_chart.text
        : ''

  // Map variants
  const variants = (row.product_variants ?? []).map((v) => ({
    id: v.id ?? '',
    size: v.size,
    color: v.color ?? '',
    color_hex: v.color_hex ?? null,
    sku: v.sku ?? `${row.slug}-${v.size}`,
    stock_status: v.stock_status,
  }))

  // Map highlights from JSONB column
  const highlights: ProductHighlight[] = Array.isArray(row.highlights)
    ? row.highlights.map((h) => ({
        label: h.key ?? '',
        value: h.value ?? '',
      })).filter((h) => h.label)
    : []

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.categories?.slug ?? 't-shirts',

    price: `₹${row.price_inr.toLocaleString('en-IN')}`,
    priceINR: row.price_inr,
    priceUSD: row.price_usd,

    image,
    gallery: gallery.length > 0 ? gallery : ['/placeholder.png'],
    images: gallery.length > 0 ? gallery : ['/placeholder.png'],

    sizes,
    defaultSize,
    variants,

    description: row.description ?? '',
    sizeChart: sizeChartText,
    washCare: row.wash_care ?? '',
    returnPolicy: DEFAULT_RETURN_POLICY,
    highlights,

    is_new_arrival: row.is_new_arrival,
    is_best_seller: row.is_best_seller,
  }
}

// ── Shared select string ──────────────────────────────────────────────────────
const PRODUCT_SELECT = `
  id, name, slug, description,
  price_inr, price_usd, status,
  is_new_arrival, is_best_seller,
  wash_care, size_chart, highlights, tags,
  meta_title, meta_description,
  categories (id, name, slug),
  product_images (url, is_primary, sort_order, alt_text),
  product_variants (id, color, color_hex, size, sku, stock_status, sort_order)
`

// ── getProducts ───────────────────────────────────────────────────────────────
export async function getProducts({
  categorySlug,
  sort = 'newest',
  limit = 24,
  page = 1,
  colors = [],
  minPrice,
  maxPrice,
}: {
  categorySlug?: string
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'best_seller'
  limit?: number
  page?: number
  colors?: string[]
  minPrice?: number
  maxPrice?: number
} = {}) {
  const supabase = await createClient()
  const offset = (page - 1) * limit

  let query = supabase
    .from('products')
    .select(PRODUCT_SELECT, { count: 'exact' })
    .eq('status', 'active')

  if (categorySlug) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (minPrice !== undefined) query = query.gte('price_inr', minPrice)
  if (maxPrice !== undefined) query = query.lte('price_inr', maxPrice)

  if (sort === 'best_seller') {
    query = query.eq('is_best_seller', true)
  }

  switch (sort) {
    case 'price_asc':
      query = query.order('price_inr', { ascending: true }); break
    case 'price_desc':
      query = query.order('price_inr', { ascending: false }); break
    case 'name_asc':
      query = query.order('name', { ascending: true }); break
    case 'best_seller':
      query = query.order('sort_order', { ascending: true }); break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1)

  let products = (data ?? []).map((row) => mapProduct(row as ProductRow))

  if (colors.length > 0) {
    products = products.filter((p) =>
      p.variants.some((v) =>
        colors.some((c) => v.color.toLowerCase() === c.toLowerCase())
      )
    )
  }

  return { products, total: count ?? 0, error }
}

// ── getProductBySlug ──────────────────────────────────────────────────────────
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      id, name, slug,
      price_inr, price_usd,
      description, wash_care, size_chart, highlights,
      is_new_arrival, is_best_seller,
      meta_title, meta_description,
      categories (name, slug),
      product_images (id, url, alt_text, is_primary, sort_order),
      product_variants (id, color, color_hex, size, sku, stock_status, sort_order)
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error || !data) return null

  return mapProduct(data as ProductRow)
}

// ── getRelatedProducts ────────────────────────────────────────────────────────
export async function getRelatedProducts(
  categorySlug: string,
  excludeSlug: string
): Promise<Product[]> {
  const supabase = await createClient()

  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (!cat) return []

  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('status', 'active')
    .eq('category_id', cat.id)
    .neq('slug', excludeSlug)
    .limit(4)

  return (data ?? []).map((row) => mapProduct(row as ProductRow))
}

// ── getCategories ─────────────────────────────────────────────────────────────
export async function getCategories() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('categories')
    .select('id, name, slug, image_url')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  return data ?? []
}

// ── getCategoryBySlug ─────────────────────────────────────────────────────────
export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('categories')
    .select('id, name, slug, image_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  return data ?? null
}

// ── collectionProducts — backwards compat ─────────────────────────────────────
export const collectionProducts: Product[] = []