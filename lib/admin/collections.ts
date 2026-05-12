import { createAdminClient } from '@/lib/supabase/admin'
import { cacheDel, CACHE_KEYS } from '@/lib/redis'

export type AdminCollection = {
  id: string
  name: string
  slug: string
  filter_rule: string
  sort_order: number
  is_active: boolean
}

export async function getAllCollections() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('collections')
    .select('id, name, slug, filter_rule, sort_order, is_active')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('getAllCollections error:', error)
  }

  return (data ?? []) as AdminCollection[]
}

export async function createCollection(data: {
  name: string
  slug: string
  filter_rule: string
  sort_order?: number
  is_active?: boolean
}) {
  const supabase = createAdminClient()

  const { data: collection, error } = await supabase
    .from('collections')
    .insert({
      name: data.name,
      slug: data.slug,
      filter_rule: data.filter_rule,
      sort_order: data.sort_order ?? 0,
      is_active: data.is_active ?? true,
    })
    .select()
    .single()

  if (!error) {
    await cacheDel(CACHE_KEYS.collections())
  }

  return { collection, error }
}

export async function updateCollection(
  id: string,
  data: Partial<{
    name: string
    slug: string
    filter_rule: string
    sort_order: number
    is_active: boolean
  }>
) {
  const supabase = createAdminClient()

  const { data: collection, error } = await supabase
    .from('collections')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (!error) {
    await cacheDel(CACHE_KEYS.collections())
  }

  return { collection, error }
}

export async function deleteCollection(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id)

  if (!error) {
    await cacheDel(CACHE_KEYS.collections())
  }

  return { error }
}

// ── Collection Product Assignments ──────────────────────────────────────────

export type CollectionProductRow = {
  collection_id: string
  product_id: string
}

export async function getCollectionProductIds(
  collectionId: string
): Promise<string[]> {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('collection_products')
    .select('product_id')
    .eq('collection_id', collectionId)

  return (data ?? []).map((r) => r.product_id)
}

export async function getAllCollectionProductIds(): Promise<
  Record<string, string[]>
> {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('collection_products')
    .select('collection_id, product_id')

  const map: Record<string, string[]> = {}
  for (const row of data ?? []) {
    if (!map[row.collection_id]) map[row.collection_id] = []
    map[row.collection_id].push(row.product_id)
  }
  return map
}

export async function setCollectionProducts(
  collectionId: string,
  productIds: string[]
) {
  const supabase = createAdminClient()

  const { error: delError } = await supabase
    .from('collection_products')
    .delete()
    .eq('collection_id', collectionId)

  if (delError) return { error: delError }

  if (productIds.length === 0) return { error: null }

  const { error: insError } = await supabase
    .from('collection_products')
    .insert(
      productIds.map((product_id) => ({ collection_id: collectionId, product_id }))
    )

  return { error: insError }
}

export async function getAllProductsForPicker() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug')
    .eq('status', 'active')
    .order('name', { ascending: true })

  return { products: data ?? [], error }
}
