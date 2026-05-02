import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { submitBanianOrder } from '@/lib/banian'

export async function POST(req: Request) {
  try {
    const secret = req.headers.get('x-internal-secret')
    if (secret !== process.env.INTERNAL_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId } = await req.json()
    const supabase = createAdminClient()

    const { data: order } = await supabase
      .from('orders')
      .select(`
        id, order_number,
        shipping_address_snapshot,
        profiles (email, first_name, last_name, phone),
        order_items (
          product_name, variant_sku, color, size, quantity,
          product_variants!order_items_variant_id_fkey (banian_sku)
        )
      `)
      .eq('id', orderId)
      .single()

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const addr = order.shipping_address_snapshot as {
      full_name?: string; line1?: string; line2?: string
      city?: string; state?: string; postal_code?: string
      country?: string; phone?: string
    }

    const profile = order.profiles as {
      first_name?: string; last_name?: string; phone?: string
    } | null

    const customerName = addr?.full_name ??
      [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ?? 'Customer'

    const phone = addr?.phone ?? profile?.phone ?? ''

    const items = (order.order_items as {
      product_name: string
      variant_sku: string
      color: string
      size: string
      quantity: number
      product_variants: { banian_sku: string | null } | null
    }[]).map((item) => ({
      productName: item.product_name,
      sku: item.variant_sku,
      banianSku: item.product_variants?.banian_sku ?? null,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    }))

    const results = await submitBanianOrder({
      orderNumber: order.order_number,
      customerName,
      phone,
      address: {
        line1: addr?.line1 ?? '',
        line2: addr?.line2,
        city: addr?.city ?? '',
        state: addr?.state ?? '',
        postalCode: addr?.postal_code ?? '',
        country: addr?.country ?? 'India',
      },
      items,
    })

    // Save form submission result to tracking
    await supabase.from('order_tracking').upsert({
      order_id: order.id,
      banian_form_response: results,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'order_id' })

    const allSuccess = results.every((r) => r.success)

    if (!allSuccess) {
      console.error('Banian partial failure:', results)
    }

    return NextResponse.json({ ok: true, results })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Banian fulfill error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}