import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { createGelatoOrder } from '@/lib/gelato'

const FulfillGelatoSchema = z.object({
  orderId: z.string().uuid(),
})

export async function POST(req: Request) {
  try {
    const secret = req.headers.get('x-internal-secret')
    if (secret !== process.env.INTERNAL_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
    }

    const parsed = FulfillGelatoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed.', issues: parsed.error.issues },
        { status: 422 }
      )
    }

    const { orderId } = parsed.data

    const supabase = createAdminClient()

    // ── Fetch order ───────────────────────────────────
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id, order_number, currency,
        shipping_address_snapshot,
        profiles (id, email, first_name, last_name),
        order_items (
          id, product_name, variant_sku, color, size, quantity, unit_price,
          product_variants!order_items_variant_id_fkey (
            gelato_product_uid,
            gelato_print_file_front,
            gelato_print_file_back
          )
        ),
        order_tracking (gelato_order_id)
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if already fulfilled
    const existingTracking = Array.isArray(order.order_tracking)
      ? order.order_tracking[0]
      : order.order_tracking

    if (existingTracking?.gelato_order_id) {
      return NextResponse.json({
        ok: true,
        message: 'Already fulfilled',
        gelatoOrderId: existingTracking.gelato_order_id,
      })
    }

    // ── Build shipping address ────────────────────────
    const addr = order.shipping_address_snapshot as {
      full_name?: string; line1?: string; line2?: string
      city?: string; state?: string; postal_code?: string
      country?: string; phone?: string
    } | null

    if (!addr?.line1 || !addr?.city || !addr?.postal_code || !addr?.country) {
      return NextResponse.json({ error: 'Incomplete shipping address' }, { status: 400 })
    }

    const profile = order.profiles as {
      email?: string; first_name?: string; last_name?: string
    } | null

    const nameParts = (addr.full_name ?? '').split(' ')
    const firstName = nameParts[0] || profile?.first_name || 'Customer'
    const lastName = nameParts.slice(1).join(' ') || profile?.last_name || '.'

    // Truncate to Gelato's 25 char limit
    const shippingAddress = {
      firstName: firstName.slice(0, 25),
      lastName: lastName.slice(0, 25),
      addressLine1: addr.line1.slice(0, 35),
      addressLine2: addr.line2 ? addr.line2.slice(0, 35) : undefined,
      city: addr.city.slice(0, 30),
      state: addr.state ? addr.state.slice(0, 35) : undefined,
      postCode: addr.postal_code.slice(0, 15),
      country: addr.country.toUpperCase().slice(0, 2), // must be ISO 2-letter
      email: profile?.email ?? 'orders@albaeon.com',
      phone: addr.phone ? addr.phone.slice(0, 25) : undefined,
    }

    // ── Build Gelato order items ───────────────────────
    const orderItems = order.order_items as {
      id: string
      product_name: string
      variant_sku: string
      color: string
      size: string
      quantity: number
      product_variants: {
        gelato_product_uid: string | null
        gelato_print_file_front: string | null
        gelato_print_file_back: string | null
      } | null
    }[]

    const gelatoItems = []
    const errors: string[] = []

    for (const item of orderItems) {
      const variant = item.product_variants
      const productUid = variant?.gelato_product_uid
      const frontFile = variant?.gelato_print_file_front
      const backFile = variant?.gelato_print_file_back

      if (!productUid) {
        errors.push(`${item.product_name} (${item.color}/${item.size}) — missing Gelato Product UID`)
        continue
      }

      if (!frontFile) {
        errors.push(`${item.product_name} (${item.color}/${item.size}) — missing print file`)
        continue
      }

      const files: { type: string; url: string }[] = [
        { type: 'default', url: frontFile },
      ]

      if (backFile) {
        files.push({ type: 'back', url: backFile })
      }

      gelatoItems.push({
        itemReferenceId: item.id,
        productUid,
        files,
        quantity: item.quantity,
      })
    }

    if (gelatoItems.length === 0) {
      return NextResponse.json({
        error: `Cannot fulfill — ${errors.join('; ')}`,
      }, { status: 400 })
    }

    // ── Create Gelato order ───────────────────────────
    const gelatoOrder = await createGelatoOrder({
      orderReferenceId: order.order_number,
      customerReferenceId: profile?.email ?? order.id,
      currency: (order.currency ?? 'USD').toUpperCase(),
      items: gelatoItems,
      shippingAddress,
      returnAddress: { companyName: 'Albaeon' },
    })

    // ── Save Gelato order ID ──────────────────────────
    await supabase
      .from('order_tracking')
      .upsert({
        order_id: order.id,
        gelato_order_id: gelatoOrder.id,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'order_id' })

    await supabase
      .from('orders')
      .update({
        status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)

    // Log any partial errors
    if (errors.length > 0) {
      console.warn('Gelato fulfill partial errors:', errors)
    }

    return NextResponse.json({
      ok: true,
      gelatoOrderId: gelatoOrder.id,
      fulfillmentStatus: gelatoOrder.fulfillmentStatus,
      warnings: errors.length > 0 ? errors : undefined,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Gelato fulfill error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}