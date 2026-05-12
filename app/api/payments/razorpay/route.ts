import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { checkoutRatelimit, getClientIp } from '@/lib/ratelimit'

const CreatePaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().max(10).optional(),
})

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const { success } = await checkoutRatelimit.limit(ip)
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429 }
      )
    }

    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { data: null, error: 'Please login to checkout' },
        { status: 401 }
      )
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ data: null, error: 'Invalid JSON.' }, { status: 400 })
    }

    const parsed = CreatePaymentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { data: null, error: 'Validation failed.', issues: parsed.error.issues },
        { status: 422 }
      )
    }

    const { amount, currency = 'INR' } = parsed.data

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // convert to paise
      currency,
      receipt: `albaeon_${Date.now()}`,
    })

    return NextResponse.json({ data: order, error: null })
  } catch (err) {
    console.error('Razorpay order error:', err)
    return NextResponse.json(
      { data: null, error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
