import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  try {
    const { amount, currency = 'INR' } = await req.json()

    if (!amount || amount < 1) {
      return NextResponse.json(
        { data: null, error: 'Invalid amount' },
        { status: 400 }
      )
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
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