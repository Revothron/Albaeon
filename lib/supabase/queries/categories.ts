import { createClient } from '@/lib/supabase/server'

export async function getCategories() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('categories')
    .select('id, name, slug, image_url')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

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