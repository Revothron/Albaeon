import { createClient } from '@/lib/supabase/server'

// ── Fetch all active products (with optional category filter) ──
export async function getProducts({
  categorySlug,
  sort = 'newest',
  limit = 24,
  page = 1,
}: {
  categorySlug?: string
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc'
  limit?: number
  page?: number
} = {}) {
  const supabase = await createClient()
  const offset = (page - 1) * limit

  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price_inr,
      price_usd,
      is_new_arrival,
      is_best_seller,
      category_id,
      product_images (url, is_primary),
      categories (name, slug)
    `, { count: 'exact' })
    .eq('status', 'active')

  // Category filter
  if (categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (category) {
      query = query.eq('category_id', category.id)
    }
  }

  // Sort
  switch (sort) {
    case 'price_asc':
      query = query.order('price_inr', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price_inr', { ascending: false })
      break
    case 'name_asc':
      query = query.order('name', { ascending: true })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1)

  return { products: data ?? [], total: count ?? 0, error }
}

// ── Fetch single product by slug ──
export async function getProductBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      sku,
      description,
      price_inr,
      price_usd,
      is_new_arrival,
      is_best_seller,
      wash_care,
      size_chart,
      tags,
      meta_title,
      meta_description,
      category_id,
      product_images (id, url, alt_text, is_primary, sort_order),
      product_variants (id, color, color_hex, size, sku, stock_status, sort_order),
      categories (name, slug)
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  return { product: data, error }
}

// ── Fetch related products (same category, exclude current) ──
export async function getRelatedProducts(categoryId: string, excludeSlug: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select(`
      id, name, slug, price_inr, price_usd,
      product_images (url, is_primary)
    `)
    .eq('status', 'active')
    .eq('category_id', categoryId)
    .neq('slug', excludeSlug)
    .limit(4)

  return data ?? []
}