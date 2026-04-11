import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  getAnalyticsOverview,
  getRevenueAnalytics,
  getOrdersAnalytics,
  getProductsAnalytics,
  getCategoryAnalytics,
  getCouponsAnalytics,
} from '@/lib/admin/analytics'

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') ?? 'overview'
  const range = searchParams.get('range') ?? '30D'

  const map: Record<string, (range: string) => Promise<unknown>> = {
    overview: getAnalyticsOverview,
    revenue: getRevenueAnalytics,
    orders: getOrdersAnalytics,
    products: getProductsAnalytics,
    category: getCategoryAnalytics,
    coupons: getCouponsAnalytics,
  }

  const fn = map[type]
  if (!fn) return NextResponse.json({ error: 'Unknown type' }, { status: 400 })

  const data = await fn(range)
  return NextResponse.json(data)
}