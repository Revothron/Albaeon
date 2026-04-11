import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json()

    if (!code || typeof subtotal !== 'number') {
      return NextResponse.json(
        { data: null, error: 'Missing code or subtotal' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (error || !coupon) {
      return NextResponse.json(
        { data: null, error: 'Invalid or expired coupon code' },
        { status: 404 }
      )
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json(
        { data: null, error: 'This coupon has expired' },
        { status: 400 }
      )
    }

    // Check usage limit
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