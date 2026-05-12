import { NextResponse } from 'next/server'
import { renderToStream } from '@react-pdf/renderer'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { InvoiceDocument, type InvoiceOrder, getHsnCode } from '@/lib/invoice'
import { createElement } from 'react'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const orderNumber = searchParams.get('order')

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number required' }, { status: 400 })
    }

    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminSupabase = createAdminClient()

    // Fetch order — must be delivered and owned by this user
    const { data: order, error } = await adminSupabase
      .from('orders')
      .select(`
        id, order_number, status, currency,
        subtotal, discount_amount, shipping_amount, total_amount,
        payment_gateway, payment_id, created_at,
        shipping_address_snapshot,
        profiles (email, first_name, last_name),
        coupons (code),
        order_items (
          product_name, variant_sku, color, size,
          quantity, unit_price, subtotal
        )
      `)
      .eq('order_number', orderNumber.toUpperCase())
      .eq('user_id', user.id)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Only allow invoice download for delivered orders
    if (order.status !== 'delivered') {
      return NextResponse.json(
        { error: 'Invoice is only available after delivery' },
        { status: 403 }
      )
    }

    // Build invoice data
    const addr = order.shipping_address_snapshot as {
      full_name?: string; line1?: string; line2?: string
      city?: string; state?: string; postal_code?: string
      country?: string; phone?: string
    } | null

    const profile = order.profiles as {
      email?: string; first_name?: string; last_name?: string
    } | null

    const coupon = Array.isArray(order.coupons)
      ? order.coupons[0]
      : order.coupons as { code?: string } | null

    const orderItems = order.order_items as {
      product_name: string; variant_sku: string; color: string
      size: string; quantity: number; unit_price: number; subtotal: number
    }[]

    const invoiceData: InvoiceOrder = {
      orderNumber: order.order_number,
      createdAt: order.created_at,
      currency: order.currency ?? 'INR',
      subtotal: order.subtotal,
      discountAmount: order.discount_amount ?? 0,
      shippingAmount: order.shipping_amount ?? 0,
      totalAmount: order.total_amount,
      couponCode: coupon?.code ?? null,
      paymentGateway: order.payment_gateway ?? 'razorpay',
      paymentId: order.payment_id,
      customerEmail: profile?.email ?? '',
      shippingAddress: {
        fullName: addr?.full_name ?? [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ?? 'Customer',
        line1: addr?.line1 ?? '',
        line2: addr?.line2,
        city: addr?.city ?? '',
        state: addr?.state ?? '',
        postalCode: addr?.postal_code ?? '',
        country: addr?.country ?? '',
        phone: addr?.phone,
      },
      items: orderItems.map((item) => ({
        name: item.product_name,
        color: item.color,
        size: item.size,
        sku: item.variant_sku,
        hsnCode: getHsnCode(item.product_name),
        quantity: item.quantity,
        unitPrice: item.unit_price,
        subtotal: item.subtotal,
      })),
      bankDetails: {
        beneficiary: process.env.BENEFICIARY_NAME ?? 'Albaeon Clothing',
        bankName: process.env.BANK_NAME ?? 'HDFC Bank',
        accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? '1234567890',
        ifsc: process.env.BANK_IFSC_CODE ?? 'HDFC0001234',
        branch: process.env.BANK_BRANCH ?? 'Mumbai Main',
      },
    }

    // Generate PDF
    const stream = await renderToStream(
      createElement(InvoiceDocument, { order: invoiceData })
    )

    // Convert stream to buffer
    const chunks: Buffer[] = []
    for await (const chunk of stream as AsyncIterable<Buffer>) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
    const pdfBuffer = Buffer.concat(chunks)

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Albaeon-Invoice-${order.order_number}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (err) {
    console.error('Invoice generation error:', err)
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 })
  }
}