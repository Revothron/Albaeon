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
import { requireAdmin } from '@/lib/auth/require-admin'

export async function GET(req: Request) {
  const authError = await requireAdmin()
  if (authError) return authError

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

  try {
    const data = await fn(range)
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Analytics API error for type=${type} range=${range}:`, error)
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 })
  }
}