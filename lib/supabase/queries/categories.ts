import { cacheGet, cacheSet, CACHE_KEYS, TTL } from '@/lib/redis'
import { createClient } from '@/lib/supabase/server'

export async function getCategories() {
  const key = CACHE_KEYS.categories()

  const cached = await cacheGet<{ id: string; name: string; slug: string; image_url: string | null }[]>(key)
  if (cached) return cached
  const supabase = await createClient()

  const { data } = await supabase
    .from('categories')
    .select('id, name, slug, image_url')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (data) {
    await cacheSet(key, data, TTL.CATEGORIES)
  }

  return data ?? []
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('categories')
    .select('id, name, slug, image_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  return data
}