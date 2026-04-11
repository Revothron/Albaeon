import { createAdminClient } from '@/lib/supabase/admin'

export type AdminOrder = {
  id: string
  customer: string
  email: string
  date: string
  amount: string
  payment: { label: string; tone: 'success' | 'warning' | 'error' | 'muted' | 'info' }
  fulfillment: { label: string; tone: 'success' | 'warning' | 'error' | 'muted' | 'info' }
  provider: string
}

export async function getAdminOrders({
  page = 1,
  limit = 20,
  search = '',
  paymentStatus = '',
  fulfillmentStatus = '',
  provider = '',
}: {
  page?: number
  limit?: number
  search?: string
  paymentStatus?: string
  fulfillmentStatus?: string
  provider?: string
} = {}) {
  const supabase = createAdminClient()
  const offset = (page - 1) * limit

  let query = supabase
    .from('orders')
    .select(`
      id,
      order_number,
      total_amount,
      status,
      payment_status,
      payment_gateway,
      provider,
      created_at,
      profiles (email, first_name, last_name)
    `, { count: 'exact' })

  if (paymentStatus && paymentStatus !== 'All') {
    query = query.eq('payment_status', paymentStatus.toLowerCase())
  }

  if (fulfillmentStatus && fulfillmentStatus !== 'All') {
    query = query.eq('status', fulfillmentStatus.toLowerCase())
  }

  if (provider && provider !== 'All') {
    const providerMap: Record<string, string> = {
      'Banian City': 'banian',
      'Gelato': 'gelato',
    }
    query = query.eq('provider', providerMap[provider] ?? provider.toLowerCase())
  }

  if (search) {
    query = query.ilike('order_number', `%${search}%`)
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error || !data) return { orders: [], total: 0 }

  const orders: AdminOrder[] = data.map((o) => {
    const profile = o.profiles as { email?: string; first_name?: string; last_name?: string } | null
    const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Guest'

    const paymentTone =
      o.payment_status === 'paid' ? 'success'
      : o.payment_status === 'failed' ? 'error'
      : o.payment_status === 'refunded' ? 'info'
      : 'warning'

    const fulfillmentTone =
      o.status === 'delivered' ? 'success'
      : o.status === 'shipped' ? 'info'
      : o.status === 'cancelled' ? 'error'
      : o.status === 'processing' ? 'warning'
      : 'muted'

    return {
      id: o.order_number,
      customer: name,
      email: profile?.email ?? '',
      date: new Date(o.created_at).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      }),
      amount: `₹${(o.total_amount ?? 0).toLocaleString('en-IN')}`,
      payment: {
        label: (o.payment_status ?? 'pending').charAt(0).toUpperCase() + (o.payment_status ?? 'pending').slice(1),
        tone: paymentTone as AdminOrder['payment']['tone'],
      },
      fulfillment: {
        label: (o.status ?? 'pending').charAt(0).toUpperCase() + (o.status ?? 'pending').slice(1),
        tone: fulfillmentTone as AdminOrder['fulfillment']['tone'],
      },
      provider: o.provider === 'banian' ? 'Banian City' : 'Gelato',
    }
  })

  return { orders, total: count ?? 0 }
}

export async function getAdminOrderById(id: string) {
  const supabase = createAdminClient()

  // Try by order_number first, then by id
  let { data } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      payment_status,
      payment_gateway,
      payment_id,
      provider,
      subtotal,
      discount_amount,
      shipping_amount,
      total_amount,
      currency,
      notes,
      created_at,
      updated_at,
      shipping_address_snapshot,
      profiles (
        id, email, first_name, last_name, phone, created_at
      ),
      order_items (
        id, product_name, variant_sku, color, size,
        quantity, unit_price, subtotal,
        product_images:products (
          product_images (url, is_primary)
        )
      ),
      order_tracking (
        tracking_number, courier, courier_url,
        estimated_delivery, gelato_order_id,
        banian_form_response, updated_at
      ),
      coupons (code, type, value)
    `)
    .eq('order_number', id.toUpperCase())
    .single()

  if (!data) {
    const res = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        payment_status,
        payment_gateway,
        payment_id,
        provider,
        subtotal,
        discount_amount,
        shipping_amount,
        total_amount,
        currency,
        notes,
        created_at,
        updated_at,
        shipping_address_snapshot,
        profiles (
          id, email, first_name, last_name, phone, created_at
        ),
        order_items (
          id, product_name, variant_sku, color, size,
          quantity, unit_price, subtotal,
          product_images:products (
            product_images (url, is_primary)
          )
        ),
        order_tracking (
          tracking_number, courier, courier_url,
          estimated_delivery, gelato_order_id,
          banian_form_response, updated_at
        ),
        coupons (code, type, value)
      `)
      .eq('id', id)
      .single()
    data = res.data
  }

  return data ?? null
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
  return { error: error?.message ?? null }
}

export async function saveOrderTracking(orderId: string, tracking: {
  tracking_number: string
  courier: string
  courier_url: string
}) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('order_tracking')
    .upsert({
      order_id: orderId,
      ...tracking,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'order_id' })
  return { error: error?.message ?? null }
}

export async function saveOrderNotes(orderId: string, notes: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('orders')
    .update({ notes, updated_at: new Date().toISOString() })
    .eq('id', orderId)
  return { error: error?.message ?? null }
}