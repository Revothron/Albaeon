// ── Supabase queries (add below existing code) ────────
import { createAdminClient } from '@/lib/supabase/admin'

export type AdminCustomerOrderStatus = "Shipped" | "Delivered" | "Processing" | "Pending";

export type AdminCustomerListItem = {
  id: string
  name: string
  username: string
  registered: string
  email: string
  orders: string
  spent: string
  lastOrder: string
  aov: string
  countryCode: string
  city: string
  region: string
  postal: string
}

export async function getAdminCustomers({
  page = 1,
  limit = 20,
  search = '',
  country = '',
  since = '',
}: {
  page?: number
  limit?: number
  search?: string
  country?: string
  since?: string
} = {}) {
  const supabase = createAdminClient()
  const offset = (page - 1) * limit

  // Build date filter
  let sinceDate: string | null = null
  if (since && since !== 'Recent Registered') {
    const now = new Date()
    const map: Record<string, number> = {
      'one week': 7,
      'Two Week': 14,
      'one Month': 30,
      'Two Month': 60,
      'Three Month': 90,
    }
    const days = map[since]
    if (days) {
      now.setDate(now.getDate() - days)
      sinceDate = now.toISOString()
    }
  }

  let query = supabase
    .from('profiles')
    .select('id, email, first_name, last_name, display_name, created_at', {
      count: 'exact',
    })
    .eq('role', 'customer')

  if (search) {
    query = query.or(
      `email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,display_name.ilike.%${search}%`
    )
  }

  if (sinceDate) {
    query = query.gte('created_at', sinceDate)
  }

  const { data: profiles, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (!profiles) return { customers: [], total: 0 }

  // Fetch order stats per customer
  const customers: AdminCustomerListItem[] = await Promise.all(
    profiles.map(async (profile) => {
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, created_at, shipping_address_snapshot')
        .eq('user_id', profile.id)
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: false })

      const orderCount = orders?.length ?? 0
      const totalSpent = (orders ?? []).reduce(
        (sum, o) => sum + (o.total_amount ?? 0), 0
      )
      const aov = orderCount > 0 ? totalSpent / orderCount : 0
      const lastOrder = orders?.[0]
        ? new Date(orders[0].created_at).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
          })
        : '—'

      const snapshot = orders?.[0]?.shipping_address_snapshot as {
        city?: string
        state?: string
        postal_code?: string
        country?: string
      } | null

      const name =
        [profile.first_name, profile.last_name].filter(Boolean).join(' ') ||
        profile.display_name ||
        '—'

      const username = profile.email?.split('@')[0] ?? '—'

      return {
        id: profile.id,
        name,
        username,
        registered: new Date(profile.created_at).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric',
        }),
        email: profile.email ?? '—',
        orders: orderCount.toString(),
        spent: totalSpent > 0 ? `₹${totalSpent.toLocaleString('en-IN')}` : '₹0',
        lastOrder,
        aov: aov > 0 ? `₹${Math.round(aov).toLocaleString('en-IN')}` : '—',
        countryCode: snapshot?.country ?? '—',
        city: snapshot?.city ?? '—',
        region: snapshot?.state ?? '—',
        postal: snapshot?.postal_code ?? '—',
      }
    })
  )

  return { customers, total: count ?? 0 }
}

export async function getAdminCustomerByIdFromDB(id: string) {
  const supabase = createAdminClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, display_name, created_at, phone, is_active')
    .eq('id', id)
    .single()

  if (!profile) return null

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      total_amount,
      status,
      created_at,
      shipping_address_snapshot
    `)
    .eq('user_id', id)
    .order('created_at', { ascending: false })

  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', id)

  const orderCount = orders?.length ?? 0
  const totalSpent = (orders ?? []).reduce((sum, o) => sum + (o.total_amount ?? 0), 0)
  const aov = orderCount > 0 ? totalSpent / orderCount : 0

  const lastOrderDate = orders?.[0]
    ? new Date(orders[0].created_at).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : '—'

  const snapshot = orders?.[0]?.shipping_address_snapshot as {
    city?: string; state?: string; postal_code?: string; country?: string
  } | null

  const shippingAddr = addresses?.find((a) => a.type === 'shipping')
  const billingAddr = addresses?.find((a) => a.type === 'billing') ?? shippingAddr

  const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ') ||
    profile.display_name || profile.email || '—'

  const segment =
    orderCount === 0 ? 'No Orders'
    : orderCount >= 5 ? 'Repeat Buyer'
    : orderCount >= 2 ? 'Occasional Buyer'
    : 'New Customer'

  return {
    id: profile.id,
    name,
    username: profile.email?.split('@')[0] ?? '—',
     isBanned: profile.is_active === false,
    registered: new Date(profile.created_at).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    }),
    email: profile.email ?? '—',
    phone: profile.phone ?? '—',
    orders: orderCount,
    spent: totalSpent > 0 ? `₹${totalSpent.toLocaleString('en-IN')}` : '₹0',
    lastOrder: lastOrderDate,
    aov: aov > 0 ? `₹${Math.round(aov).toLocaleString('en-IN')}` : '—',
    countryCode: snapshot?.country ?? shippingAddr?.country ?? '—',
    country: snapshot?.country ?? shippingAddr?.country ?? '—',
    city: snapshot?.city ?? shippingAddr?.city ?? '—',
    region: snapshot?.state ?? shippingAddr?.state ?? '—',
    postal: snapshot?.postal_code ?? shippingAddr?.postal_code ?? '—',
    memberSince: new Date(profile.created_at).toLocaleDateString('en-IN', {
      month: 'long', year: 'numeric',
    }),
    segment,
    shippingAddress: shippingAddr
      ? [
          shippingAddr.full_name ?? name,
          shippingAddr.line1,
          shippingAddr.line2 ?? '',
          `${shippingAddr.city}, ${shippingAddr.state} ${shippingAddr.postal_code}`,
          `${shippingAddr.country} / ${profile.phone ?? '—'}`,
        ].filter(Boolean)
      : [name, '—'],
    billingAddress: billingAddr
      ? [
          billingAddr.full_name ?? name,
          billingAddr.line1,
          billingAddr.line2 ?? '',
          `${billingAddr.city}, ${billingAddr.state} ${billingAddr.postal_code}`,
          `${billingAddr.country} / ${profile.phone ?? '—'}`,
        ].filter(Boolean)
      : [name, '—'],
    orderHistory: (orders ?? []).map((o) => ({
      id: o.order_number,
      date: new Date(o.created_at).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      }),
      amount: `₹${(o.total_amount ?? 0).toLocaleString('en-IN')}`,
      status: (
        o.status === 'delivered' ? 'Delivered'
        : o.status === 'shipped' ? 'Shipped'
        : o.status === 'processing' ? 'Processing'
        : 'Pending'
      ) as AdminCustomerOrderStatus,
    })),
  }
}