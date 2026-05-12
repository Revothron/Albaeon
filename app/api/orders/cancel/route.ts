import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { orderNumber } = await req.json()
    if (!orderNumber) return NextResponse.json({ error: 'Order number required' }, { status: 400 })

    const adminSupabase = createAdminClient()

    // ── Fetch order ───────────────────────────────────
    const { data: order, error: fetchError } = await adminSupabase
      .from('orders')
      .select('id, order_number, status, payment_status, payment_id, payment_gateway, total_amount, user_id')
      .eq('order_number', orderNumber.toUpperCase())
      .eq('user_id', user.id)
      .single()

    if (fetchError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // ── Validate cancellable ──────────────────────────
    if (order.status === 'cancelled') {
      return NextResponse.json({ error: 'Order is already cancelled' }, { status: 400 })
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      return NextResponse.json({
        error: 'Order cannot be cancelled after shipping. Please contact support.',
      }, { status: 400 })
    }

    // ── Initiate Razorpay refund ──────────────────────
    let refundId: string | null = null
    let refundStatus: string = 'pending'

    if (order.payment_status === 'paid' && order.payment_id && order.payment_gateway === 'razorpay') {
      try {
        const refund = await razorpay.payments.refund(order.payment_id, {
          amount: Math.round(order.total_amount * 100), // full refund in paise
          speed: 'normal',
          notes: {
            reason: 'Customer requested cancellation',
            order_number: order.order_number,
          },
        })
        refundId = refund.id
        refundStatus = refund.status === 'processed' ? 'refunded' : 'refund_pending'
      } catch (refundError) {
        console.error('Razorpay refund error:', refundError)
        // Still cancel the order but flag refund as failed
        refundStatus = 'refund_failed'
      }
    }

    // ── Update order status ───────────────────────────
    await adminSupabase
      .from('orders')
      .update({
        status: 'cancelled',
        payment_status: refundStatus === 'refunded' ? 'refunded' : 'refund_pending',
        notes: refundId
          ? `Cancelled by customer. Refund ID: ${refundId}`
          : refundStatus === 'refund_failed'
          ? 'Cancelled by customer. Refund initiation failed — manual refund required.'
          : 'Cancelled by customer. No payment to refund.',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)

    // ── Update order_tracking ─────────────────────────
    await adminSupabase
      .from('order_tracking')
      .upsert({
        order_id: order.id,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'order_id' })

    return NextResponse.json({
      ok: true,
      refundId,
      refundStatus,
      message: refundId
        ? `Order cancelled. Refund of ₹${order.total_amount.toLocaleString('en-IN')} initiated. It will reflect in 5-7 business days.`
        : 'Order cancelled successfully.',
    })
  } catch (err) {
    console.error('Cancel order error:', err)
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 })
  }
}