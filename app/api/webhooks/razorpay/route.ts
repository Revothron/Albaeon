import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendOrderConfirmation } from '@/lib/emails'

function generateOrderNumber(): string {
  const num = Math.floor(10000 + Math.random() * 90000)
  return `ALB-${num}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = createAdminClient()

    // ── Two modes ─────────────────────────────────────────
    // Mode 1: Called from frontend after payment (client-side verification)
    // Mode 2: Called from Razorpay webhook server (server-side verification)

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shipping_address,
      subtotal,
      discount_amount = 0,
      coupon_id = null,
      total,
      user_id,
    } = body

    // ── Verify signature ──────────────────────────────────
    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json(
          { data: null, error: 'Invalid payment signature' },
          { status: 400 }
        )
      }
    }

    // ── Check if order already processed (idempotency) ────
    const { data: existing } = await supabase
      .from('orders')
      .select('id, order_number')
      .eq('payment_id', razorpay_payment_id)
      .single()

    if (existing) {
      return NextResponse.json({
        data: {
          order_id: existing.id,
          order_number: existing.order_number,
        },
        error: null,
      })
    }

    // ── Get authenticated user ────────────────────────────
    let userId = user_id
    if (!userId) {
      // Try to get from session if called from frontend
      const { data: { users } } = await supabase.auth.admin.listUsers()
      // Fallback — userId must be passed from frontend
    }

    // ── Generate unique order number ──────────────────────
    let orderNumber = generateOrderNumber()
    let attempts = 0
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from('orders')
        .select('id')
        .eq('order_number', orderNumber)
        .single()
      if (!existing) break
      orderNumber = generateOrderNumber()
      attempts++
    }

    const finalTotal = total ?? (subtotal - discount_amount)

    // ── Create order ──────────────────────────────────────
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: userId ?? null,
        status: 'processing',
        payment_status: 'paid',
        payment_gateway: 'razorpay',
        payment_id: razorpay_payment_id,
        provider: 'banian',
        subtotal: subtotal ?? finalTotal,
        discount_amount: body.discount_amount ?? 0,
        shipping_amount: 0,
        total_amount: body.total ?? body.subtotal,
        currency: 'INR',
        coupon_id: coupon_id ?? null,
        shipping_address_snapshot: shipping_address ?? {},
        notes: null,
      })
      .select('id, order_number')
      .single()

    if (orderError || !order) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        { data: null, error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // ── Create order items ────────────────────────────────
    if (items && items.length > 0) {
      const orderItems = items.map((item: {
        productId: string
        variantId: string
        name: string
        sku: string
        color: string
        size: string
        quantity: number
        price: number
      }) => ({
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId,
        product_name: item.name,
        variant_sku: item.sku,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity,
      }))

      await supabase.from('order_items').insert(orderItems)
    }

    // After order is created in DB, determine provider and fulfill
    const shippingCountry = (shipping_address?.country ?? 'IN').toUpperCase()
    const isIndia = shippingCountry === 'IN'
    const provider = isIndia ? 'banian' : 'gelato'

    // Update provider on order
    await supabase.from('orders')
      .update({ provider })
      .eq('id', order.id)

    if (isIndia) {
      // ── Banian City via Google Form ─────────────────
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/fulfill/banian`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-secret': process.env.INTERNAL_API_SECRET!,
        },
        body: JSON.stringify({ orderId: order.id }),
      }).catch(console.error)
    } else {
      // ── Gelato via API ──────────────────────────────
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/fulfill/gelato`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-secret': process.env.INTERNAL_API_SECRET!,
        },
        body: JSON.stringify({ orderId: order.id }),
      }).catch(console.error)
    }


    // ── Create order tracking record ──────────────────────
    await supabase.from('order_tracking').insert({
      order_id: order.id,
      tracking_number: null,
      courier: null,
    })

    // ── Increment coupon used_count ───────────────────────
    if (coupon_id) {
      await supabase.rpc('increment_coupon_usage', { coupon_id })
    }

    // ── Send order confirmation email ─────────────────────
    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, first_name, last_name')
        .eq('id', userId)
        .single()

      if (profile?.email) {
        const customerName = [profile.first_name, profile.last_name]
          .filter(Boolean).join(' ') || 'Customer'

        const emailItems = (items ?? []).map((item: {
          name: string; color: string; size: string
          quantity: number; price: number
        }) => ({
          name: item.name,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: `₹${item.price.toLocaleString('en-IN')}`,
          subtotal: `₹${(item.price * item.quantity).toLocaleString('en-IN')}`,
        }))

        const addr = shipping_address ?? {}

        await sendOrderConfirmation({
          to: profile.email,
          customerName,
          orderNumber,
          orderDate: new Date().toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric',
          }),
          items: emailItems,
          subtotal: `₹${(subtotal ?? finalTotal).toLocaleString('en-IN')}`,
          shipping: 'Free',
          total: `₹${finalTotal.toLocaleString('en-IN')}`,
          shippingAddress: {
            line1: addr.line1 ?? '',
            line2: addr.line2,
            city: addr.city ?? '',
            state: addr.state ?? '',
            postal: addr.postal_code ?? '',
            country: addr.country ?? 'India',
          },
        }).catch(console.error)
      }
    }

    return NextResponse.json({
      data: {
        order_id: order.id,
        order_number: order.order_number,
      },
      error: null,
    })
  } catch (err) {
    console.error('Razorpay webhook error:', err)
    return NextResponse.json(
      { data: null, error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}