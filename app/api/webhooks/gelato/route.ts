import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendOrderShipped } from '@/lib/emails'

// Map Gelato fulfillment status → our order status
function mapGelatoStatus(status: string): string | null {
  const map: Record<string, string> = {
    created: 'processing',
    uploading: 'processing',
    passed: 'processing',
    in_production: 'processing',
    printed: 'processing',
    shipped: 'shipped',
    in_transit: 'shipped',
    delivered: 'delivered',
    failed: 'cancelled',
    canceled: 'cancelled',
    returned: 'cancelled',
  }
  return map[status] ?? null
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = createAdminClient()

    const { event, orderReferenceId, orderId, fulfillmentStatus } = body

    // Log all webhook events
    await supabase.from('webhook_logs').insert({
      source: 'gelato',
      event_type: event,
      payload: body,
      processed: false,
    })

    if (!orderReferenceId) {
      return NextResponse.json({ ok: true })
    }

    // Fetch our order
    const { data: order } = await supabase
      .from('orders')
      .select('id, order_number, status, profiles(email, first_name, last_name)')
      .eq('order_number', orderReferenceId.toUpperCase())
      .single()

    if (!order) {
      console.warn('Gelato webhook: order not found', orderReferenceId)
      return NextResponse.json({ ok: true })
    }

    // ── order_status_updated ──────────────────────────
    if (event === 'order_status_updated') {
      const newStatus = mapGelatoStatus(fulfillmentStatus)

      if (newStatus && newStatus !== order.status) {
        await supabase
          .from('orders')
          .update({
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', order.id)
      }

      // Extract tracking from items
      const items = body.items ?? []
      for (const item of items) {
        const fulfillments = item.fulfillments ?? []
        if (fulfillments.length > 0) {
          const f = fulfillments[0]

          await supabase
            .from('order_tracking')
            .upsert({
              order_id: order.id,
              tracking_number: f.trackingCode ?? null,
              courier: f.shipmentMethodName ?? null,
              courier_url: f.trackingUrl ?? null,
              gelato_order_id: orderId ?? null,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'order_id' })

          // Send shipped email when tracking arrives
          if (f.trackingCode && fulfillmentStatus === 'shipped') {
            const profile = order.profiles as {
              email?: string
              first_name?: string
              last_name?: string
            } | null

            if (profile?.email) {
              const customerName = [profile.first_name, profile.last_name]
                .filter(Boolean).join(' ') || 'Customer'

              await sendOrderShipped({
                to: profile.email,
                customerName,
                orderNumber: order.order_number,
                trackingNumber: f.trackingCode,
                courier: f.shipmentMethodName ?? 'Carrier',
                courierUrl: f.trackingUrl ?? '',
              }).catch(console.error)
            }
          }

          break // Use first fulfillment
        }
      }
    }

    // ── order_item_tracking_code_updated ──────────────
    if (event === 'order_item_tracking_code_updated') {
      if (body.trackingCode) {
        await supabase
          .from('order_tracking')
          .upsert({
            order_id: order.id,
            tracking_number: body.trackingCode,
            courier: body.shipmentMethodName ?? null,
            courier_url: body.trackingUrl ?? null,
            gelato_order_id: orderId ?? null,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'order_id' })
      }
    }

    // Mark as processed
    await supabase
      .from('webhook_logs')
      .update({ processed: true })
      .eq('source', 'gelato')
      .eq('event_type', event)
      .order('created_at', { ascending: false })
      .limit(1)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Gelato webhook error:', err)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}