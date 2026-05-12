import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { cacheGet, cacheSet, cacheDel, CACHE_KEYS, TTL } from '@/lib/redis'
import { checkoutRatelimit, getClientIp } from '@/lib/ratelimit'
import type { Coupon } from '@/types'

const ValidateCouponSchema = z.object({
  code: z.string().min(1).max(50),
  subtotal: z.number().positive(),
})

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const { success } = await checkoutRatelimit.limit(ip)
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      )
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ data: null, error: 'Invalid JSON.' }, { status: 400 })
    }

    const parsed = ValidateCouponSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: 'Validation failed.', issues: parsed.error.issues },
        { status: 422 }
      )
    }

    const { code, subtotal } = parsed.data

    const normalizedCode = code.toUpperCase()
    const cacheKey = CACHE_KEYS.coupon(normalizedCode)

    let coupon = await cacheGet<Coupon>(cacheKey)

    if (!coupon) {
      const supabase = await createClient()

    const { data, error } = await supabase
      .from('coupons')
      .select('id, code, type, value, min_order_amount, usage_limit, per_user_limit, used_count, is_active, expires_at')
      .eq('code', normalizedCode)
      .eq('is_active', true)
      .single()

      if (error || !data) {
        return NextResponse.json(
          { data: null, error: 'Invalid or expired coupon code' },
          { status: 404 }
        )
      }

      coupon = data as Coupon
      await cacheSet(cacheKey, coupon, TTL.COUPON)
    }

    // Check expiry (never cache this part — time-sensitive)
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json(
        { data: null, error: 'This coupon has expired' },
        { status: 400 }
      )
    }

    // Check usage limit (never cache this part — must be fresh)
    if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
      return NextResponse.json(
        { data: null, error: 'This coupon has reached its usage limit' },
        { status: 400 }
      )
    }

    // Check minimum order
    if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
      return NextResponse.json(
        {
          data: null,
          error: `Minimum order of ₹${coupon.min_order_amount.toLocaleString('en-IN')} required`,
        },
        { status: 400 }
      )
    }

    // Calculate discount
    let discount_amount = 0
    if (coupon.type === 'percentage') {
      discount_amount = Math.round((subtotal * coupon.value) / 100)
    } else {
      discount_amount = Math.min(coupon.value, subtotal)
    }

    // Invalidate cache — usage count will change after successful application
    await cacheDel(cacheKey)

    return NextResponse.json({
      data: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount_amount,
      },
      error: null,
    })
  } catch {
    return NextResponse.json(
      { data: null, error: 'Server error' },
      { status: 500 }
    )
  }
}
