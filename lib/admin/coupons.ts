import { createAdminClient } from '@/lib/supabase/admin'

export type AdminCoupon = {
  id: string
  code: string
  type: 'percentage' | 'flat'
  value: number
  min_order_amount: number | null
  usage_limit: number | null
  per_user_limit: number
  used_count: number
  is_active: boolean
  expires_at: string | null
  created_at: string
}

export async function getAdminCoupons({
  search = '',
  page = 1,
  limit = 25,
}: {
  search?: string
  page?: number
  limit?: number
} = {}) {
  const supabase = createAdminClient()
  const offset = (page - 1) * limit

    let query = supabase
      .from('coupons')
      .select('id, code, type, value, min_order_amount, usage_limit, per_user_limit, used_count, is_active, expires_at, created_at', { count: 'exact' })

  if (search) {
    query = query.ilike('code', `%${search}%`)
  }

  const { data, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return { coupons: (data ?? []) as AdminCoupon[], total: count ?? 0 }
}

export async function createCoupon(fields: {
  code: string
  type: 'percentage' | 'flat'
  value: number
  min_order_amount: number | null
  usage_limit: number | null
  per_user_limit: number
  is_active: boolean
  expires_at: string | null
}) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('coupons')
    .insert({ ...fields, used_count: 0 })
  return { error: error?.message ?? null }
}

export async function updateCoupon(id: string, fields: Partial<{
  code: string
  type: 'percentage' | 'flat'
  value: number
  min_order_amount: number | null
  usage_limit: number | null
  per_user_limit: number
  is_active: boolean
  expires_at: string | null
}>) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('coupons')
    .update(fields)
    .eq('id', id)
  return { error: error?.message ?? null }
}

export async function deleteCoupon(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', id)
  return { error: error?.message ?? null }
}