import { createAdminClient } from '@/lib/supabase/admin'
import { cacheDel, CACHE_KEYS } from '@/lib/redis'

export type AdminCategory = {
  id: string
  name: string
  slug: string
  image_url: string | null
  cloudinary_id: string | null
  parent_id: string | null
  is_active: boolean
  created_at: string
  product_count?: number
}

export async function getAllCategories() {
  const supabase = createAdminClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, image_url, cloudinary_id, parent_id, is_active, created_at')
    .order('sort_order', { ascending: true })

  if (!categories) return []

  const { data: counts } = await supabase
    .from('products')
    .select('category_id, id.count()')
    .not('category_id', 'is', null)
    .is('status', 'active')

  const countMap: Record<string, number> = {}
  if (counts) {
    for (const row of counts as { category_id: string; count: number }[]) {
      countMap[row.category_id] = Number(row.count ?? 0)
    }
  }

  return categories.map((cat) => ({
    ...cat,
    product_count: countMap[cat.id] ?? 0,
  })) as AdminCategory[]
}

export async function createCategory(data: {
  name: string
  slug: string
  image_url?: string
  cloudinary_id?: string | null
  is_active?: boolean
}) {
  const supabase = createAdminClient()

  const { data: category, error } = await supabase
    .from('categories')
    .insert({
      name: data.name,
      slug: data.slug,
      image_url: data.image_url ?? null,
      cloudinary_id: data.cloudinary_id ?? null,
      is_active: data.is_active ?? true,
    })
    .select()
    .single()

  if (!error) {
    await cacheDel(CACHE_KEYS.categories())
  }

  return { category, error }
}

export async function updateCategory(
  id: string,
  data: Partial<{
    name: string
    slug: string
    image_url: string | null
    cloudinary_id: string | null
    is_active: boolean
  }>
) {
  const supabase = createAdminClient()

  // If replacing image, delete old Cloudinary asset first
  if (data.cloudinary_id) {
    const { data: old } = await supabase
      .from('categories')
      .select('cloudinary_id')
      .eq('id', id)
      .single()

    if (old?.cloudinary_id && old.cloudinary_id !== data.cloudinary_id) {
      const { deleteImage } = await import('@/lib/cloudinary')
      await deleteImage(old.cloudinary_id).catch(() => {})
    }
  }

  const { data: category, error } = await supabase
    .from('categories')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (!error) {
    await cacheDel(CACHE_KEYS.categories())
  }

  return { category, error }
}

export async function deleteCategory(id: string) {
  const supabase = createAdminClient()

  // Delete Cloudinary image before removing the row
  const { data: cat } = await supabase
    .from('categories')
    .select('cloudinary_id')
    .eq('id', id)
    .single()

  if (cat?.cloudinary_id) {
    const { deleteImage } = await import('@/lib/cloudinary')
    await deleteImage(cat.cloudinary_id).catch(() => {})
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (!error) {
    await cacheDel(CACHE_KEYS.categories())
  }

  return { error }
}
