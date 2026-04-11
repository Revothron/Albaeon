import { createClient } from '@/lib/supabase/server'

// ── Types (unchanged — components depend on these) ────
export type CustomerOrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
export type CustomerOrderTimelineState = 'complete' | 'current' | 'upcoming'

export type CustomerOrderItem = {
  name: string
  collectionLabel: string
  color: string
  size: string
  quantity: number
  sku: string
  price: number
  image: string
}

export type CustomerOrderTrackingStep = {
  title: string
  time: string
  description: string
  state: CustomerOrderTimelineState
  update?: { label: string; time: string }
}

export type CustomerOrder = {
  id: string
  status: CustomerOrderStatus
  placedOn: string
  placedAt: string
  contactEmail: string
  items: CustomerOrderItem[]
  shippingAddress: {
    name: string
    line1: string
    line2: string
    line3: string
    phone: string
  }
  delivery: {
    method: string
    detail: string
    cost: number
  }
  tracking: {
    carrier: string
    trackingNumber: string
    trackLabel: string
    steps: CustomerOrderTrackingStep[]
  }
  payment: {
    provider: string
    method: string
    paidVia: string
    statusLabel: string
    transactionId: string
    paymentDate: string
    amountCharged: number
    currencyLabel: string
  }
  discount: number
  coupon?: { code: string; amount: number }
  issueSupport: { available: boolean; note: string }
}

// ── Helpers (unchanged) ───────────────────────────────
const currencyFormatter = new Intl.NumberFormat('en-IN')

export function formatOrderAmount(
  amount: number,
  prefix: 'Rs' | 'INR' | '₹' = '₹'
) {
  if (prefix === '₹') return `₹${currencyFormatter.format(amount)}`
  return `${prefix} ${currencyFormatter.format(amount)}`
}

export function getOrderTotalItems(order: CustomerOrder) {
  return order.items.reduce((total, item) => total + item.quantity, 0)
}

export function getOrderSubtotal(order: CustomerOrder) {
  return order.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
}

export function getOrderListMeta(order: CustomerOrder) {
  const totalItems = getOrderTotalItems(order)
  return `${order.placedOn} / ${totalItems} ${totalItems === 1 ? 'item' : 'items'} / ${formatOrderAmount(order.payment.amountCharged, 'Rs')}`
}

export function getCurrentTrackingStep(order: CustomerOrder) {
  return (
    order.tracking.steps.find((s) => s.state === 'current') ??
    [...order.tracking.steps].reverse().find((s) => s.state === 'complete') ??
    order.tracking.steps[0]
  )
}

// ── Map Supabase order row → CustomerOrder shape ──────
function mapStatus(status: string): CustomerOrderStatus {
  switch (status) {
    case 'shipped': return 'Shipped'
    case 'delivered': return 'Delivered'
    case 'cancelled': return 'Cancelled'
    default: return 'Processing'
  }
}

function buildTrackingSteps(status: CustomerOrderStatus): CustomerOrderTrackingStep[] {
  const progress =
    status === 'Processing' ? 2
    : status === 'Shipped' ? 3
    : status === 'Delivered' ? 5
    : 1

  const steps: CustomerOrderTrackingStep[] = [
    {
      title: 'ORDER PLACED',
      time: '—',
      description: 'Your order has been confirmed and payment received.',
      state: progress >= 1 ? 'complete' : 'upcoming',
    },
    {
      title: 'PROCESSING',
      time: '—',
      description: 'Your item is being prepared by our fulfilment partner.',
      state: progress >= 2 ? (progress === 2 ? 'current' : 'complete') : 'upcoming',
    },
    {
      title: 'SHIPPED',
      time: '—',
      description: 'Your order is on its way.',
      state: progress >= 3 ? (progress === 3 ? 'current' : 'complete') : 'upcoming',
    },
    {
      title: 'OUT FOR DELIVERY',
      time: '—',
      description: 'Your courier partner will attempt delivery.',
      state: progress >= 4 ? (progress === 4 ? 'current' : 'complete') : 'upcoming',
    },
    {
      title: 'DELIVERED',
      time: '—',
      description: 'Delivery confirmation will appear here once arrived.',
      state: progress >= 5 ? 'current' : 'upcoming',
    },
  ]
  return steps
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapOrder(row: any): CustomerOrder {
  const status = mapStatus(row.status)
  const addr = row.shipping_address_snapshot ?? {}
  const tracking = row.order_tracking?.[0] ?? {}
  const items = (row.order_items ?? []).map((item: {
    product_name: string
    color: string
    size: string
    quantity: number
    unit_price: number
    variant_sku: string
  }) => ({
    name: item.product_name,
    collectionLabel: '',
    color: item.color,
    size: item.size,
    quantity: item.quantity,
    sku: item.variant_sku,
    price: item.unit_price,
    image: '/placeholder.png',
  }))

  const placedDate = new Date(row.created_at)
  const placedOn = placedDate.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const placedAt = placedDate.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return {
    id: row.order_number,
    status,
    placedOn,
    placedAt,
    contactEmail: row.profiles?.email ?? '',
    items,
    shippingAddress: {
      name: addr.full_name ?? '',
      line1: addr.line1 ?? '',
      line2: `${addr.city ?? ''}, ${addr.state ?? ''} ${addr.postal_code ?? ''}`,
      line3: addr.country ?? '',
      phone: addr.phone ?? '',
    },
    delivery: {
      method: 'Standard Shipping',
      detail: status === 'Delivered' ? 'Delivered' : 'Estimated 5-7 business days',
      cost: row.shipping_amount ?? 0,
    },
    tracking: {
      carrier: tracking.courier ?? 'Delhivery',
      trackingNumber: tracking.tracking_number ?? '',
      trackLabel: `TRACK ON ${(tracking.courier ?? 'COURIER').toUpperCase()}`,
      steps: buildTrackingSteps(status),
    },
    payment: {
      provider: row.payment_gateway === 'razorpay' ? 'Razorpay' : 'Stripe',
      method: 'UPI / Card',
      paidVia: row.payment_gateway === 'razorpay' ? 'Razorpay / UPI' : 'Stripe / Card',
      statusLabel: row.payment_status === 'paid' ? 'Paid' : 'Pending',
      transactionId: row.payment_id ?? '',
      paymentDate: placedOn,
      amountCharged: row.total_amount ?? 0,
      currencyLabel: 'INR / Indian Rupees',
    },
    discount: row.discount_amount ?? 0,
    coupon: undefined,
    issueSupport: {
      available: status === 'Delivered',
      note:
        status === 'Delivered'
          ? 'Report within 48 hours of delivery with an unboxing video'
          : 'Available once your order is delivered',
    },
  }
}

// ── Supabase query — get all orders for current user ──
export async function getCustomerOrders(): Promise<CustomerOrder[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      payment_status,
      payment_gateway,
      payment_id,
      total_amount,
      subtotal,
      discount_amount,
      shipping_amount,
      currency,
      shipping_address_snapshot,
      created_at,
      order_items (
        product_name,
        variant_sku,
        color,
        size,
        quantity,
        unit_price
      ),
      order_tracking (
        tracking_number,
        courier,
        courier_url,
        estimated_delivery
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map(mapOrder)
}

// ── Supabase query — get single order by order_number ─
export async function getCustomerOrderById(
  orderNumber: string
): Promise<CustomerOrder | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      payment_status,
      payment_gateway,
      payment_id,
      total_amount,
      subtotal,
      discount_amount,
      shipping_amount,
      currency,
      shipping_address_snapshot,
      created_at,
      order_items (
        product_name,
        variant_sku,
        color,
        size,
        quantity,
        unit_price
      ),
      order_tracking (
        tracking_number,
        courier,
        courier_url,
        estimated_delivery
      )
    `)
    .eq('order_number', orderNumber.toUpperCase())
    .eq('user_id', user.id)
    .single()

  if (error || !data) return null
  return mapOrder(data)
}

// ── Supabase query — find order by lookup (track-order) ─
export async function findOrderByLookup(
  orderId: string,
  contact: string
): Promise<CustomerOrder | null> {
  // Use admin client — this is a public lookup, RLS blocks unauthenticated queries
  // Security is enforced manually by verifying contact matches below
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const supabase = createAdminClient()

  const normalized = orderId.trim().toUpperCase()
  const contactNorm = contact.trim().toLowerCase()

  if (!normalized || !contactNorm) return null

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      payment_status,
      payment_gateway,
      payment_id,
      total_amount,
      subtotal,
      discount_amount,
      shipping_amount,
      currency,
      shipping_address_snapshot,
      created_at,
      profiles (email),
      order_items (
        product_name,
        variant_sku,
        color,
        size,
        quantity,
        unit_price
      ),
      order_tracking (
        tracking_number,
        courier,
        courier_url,
        estimated_delivery
      )
    `)
    .eq('order_number', normalized)
    .single()

  if (error || !data) return null

  // ── Manual security check ─────────────────────────
  // Verify the contact matches email OR phone on the order
  const profileEmail =
    (data as { profiles?: { email?: string } }).profiles?.email?.toLowerCase() ?? ''
  const snapshotPhone =
    ((data.shipping_address_snapshot as { phone?: string })?.phone ?? '').replace(/\D/g, '')
  const inputPhone = contactNorm.replace(/\D/g, '')

  const emailMatch = profileEmail === contactNorm
  const phoneMatch = inputPhone.length >= 6 && snapshotPhone === inputPhone

  if (!emailMatch && !phoneMatch) return null

  return mapOrder(data)
}

// ── Keep for backward compat (returns empty — use async fns above) ─
export const customerOrders: CustomerOrder[] = []
export function getOrderById(_id: string): CustomerOrder | undefined {
  return undefined
}