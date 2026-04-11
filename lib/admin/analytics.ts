import { createAdminClient } from '@/lib/supabase/admin'

export const analyticsRanges = ['7D', '30D', '90D', '6M', '1Y', 'ALL']

function getFromDate(range: string): string | null {
  const now = new Date()
  switch (range) {
    case '7D': { const d = new Date(now); d.setDate(d.getDate() - 7); return d.toISOString() }
    case '30D': { const d = new Date(now); d.setDate(d.getDate() - 30); return d.toISOString() }
    case '90D': { const d = new Date(now); d.setDate(d.getDate() - 90); return d.toISOString() }
    case '6M': { const d = new Date(now); d.setMonth(d.getMonth() - 6); return d.toISOString() }
    case '1Y': { const d = new Date(now); d.setFullYear(d.getFullYear() - 1); return d.toISOString() }
    default: return null
  }
}

function getChartDates(range: string): Date[] {
  const now = new Date()
  const days =
    range === '7D' ? 7
    : range === '30D' ? 30
    : range === '90D' ? 30
    : range === '6M' ? 24
    : range === '1Y' ? 12
    : 12

  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now)
    if (range === '6M') {
      d.setDate(d.getDate() - (days - 1 - i) * 7)
    } else if (range === '1Y' || range === 'ALL') {
      d.setMonth(d.getMonth() - (days - 1 - i))
    } else {
      d.setDate(d.getDate() - (days - 1 - i))
    }
    return d
  })
}

function formatChartLabel(d: Date, range: string): string {
  if (range === '1Y' || range === 'ALL' || range === '6M') {
    return d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
  }
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

// ── Overview analytics ────────────────────────────────
export async function getAnalyticsOverview(range = '30D') {
  const supabase = createAdminClient()
  const from = getFromDate(range)

  let query = supabase
    .from('orders')
    .select('total_amount, subtotal, discount_amount, created_at, payment_status')
    .eq('payment_status', 'paid')

  if (from) query = query.gte('created_at', from)
  const { data: orders } = await query

  const totalSales = (orders ?? []).reduce((s, o) => s + (o.total_amount ?? 0), 0)
  const totalDiscount = (orders ?? []).reduce((s, o) => s + (o.discount_amount ?? 0), 0)
  const netSales = totalSales - totalDiscount
  const totalOrders = orders?.length ?? 0

  // Products sold
  let itemsQuery = supabase
    .from('order_items')
    .select('quantity, orders!inner(payment_status, created_at)')
    .eq('orders.payment_status', 'paid')

  if (from) itemsQuery = itemsQuery.gte('orders.created_at', from)
  const { data: items } = await itemsQuery

  const productsSold = (items ?? []).reduce((s, i) => s + (i.quantity ?? 0), 0)

  // Previous period for trend
  const periodMs = from ? Date.now() - new Date(from).getTime() : 0
  const prevFrom = from ? new Date(new Date(from).getTime() - periodMs).toISOString() : null

  let prevQuery = supabase
    .from('orders')
    .select('total_amount')
    .eq('payment_status', 'paid')

  if (prevFrom && from) {
    prevQuery = prevQuery.gte('created_at', prevFrom).lt('created_at', from)
  }
  const { data: prevOrders } = await prevQuery
  const prevSales = (prevOrders ?? []).reduce((s, o) => s + (o.total_amount ?? 0), 0)
  const salesTrend = prevSales > 0 ? ((totalSales - prevSales) / prevSales * 100).toFixed(1) : '0'

  // Chart data
  const chartDates = getChartDates(range)
  const chartLabels = chartDates.map((d) => formatChartLabel(d, range))

  const netSalesValues = chartDates.map((day) => {
    const nextDay = new Date(day)
    if (range === '1Y' || range === 'ALL') nextDay.setMonth(nextDay.getMonth() + 1)
    else if (range === '6M') nextDay.setDate(nextDay.getDate() + 7)
    else nextDay.setDate(nextDay.getDate() + 1)

    return (orders ?? [])
      .filter((o) => {
        const d = new Date(o.created_at)
        return d >= day && d < nextDay
      })
      .reduce((s, o) => s + (o.total_amount ?? 0) - (o.discount_amount ?? 0), 0)
  })

  const orderValues = chartDates.map((day) => {
    const nextDay = new Date(day)
    if (range === '1Y' || range === 'ALL') nextDay.setMonth(nextDay.getMonth() + 1)
    else if (range === '6M') nextDay.setDate(nextDay.getDate() + 7)
    else nextDay.setDate(nextDay.getDate() + 1)

    return (orders ?? []).filter((o) => {
      const d = new Date(o.created_at)
      return d >= day && d < nextDay
    }).length
  })

  return {
    totalSales,
    netSales,
    totalOrders,
    productsSold,
    salesTrend: Number(salesTrend),
    chartLabels,
    netSalesValues,
    orderValues,
  }
}

// ── Revenue analytics ─────────────────────────────────
export async function getRevenueAnalytics(range = '30D') {
  const supabase = createAdminClient()
  const from = getFromDate(range)

  let query = supabase
    .from('orders')
    .select('total_amount, subtotal, discount_amount, shipping_amount, created_at, payment_status, currency')
    .eq('payment_status', 'paid')

  if (from) query = query.gte('created_at', from)
  const { data: orders } = await query

  const chartDates = getChartDates(range)
  const chartLabels = chartDates.map((d) => formatChartLabel(d, range))

  const grossValues = chartDates.map((day) => {
    const nextDay = new Date(day)
    if (range === '1Y' || range === 'ALL') nextDay.setMonth(nextDay.getMonth() + 1)
    else if (range === '6M') nextDay.setDate(nextDay.getDate() + 7)
    else nextDay.setDate(nextDay.getDate() + 1)
    return (orders ?? []).filter((o) => new Date(o.created_at) >= day && new Date(o.created_at) < nextDay)
      .reduce((s, o) => s + (o.subtotal ?? 0), 0)
  })

  const netValues = chartDates.map((day) => {
    const nextDay = new Date(day)
    if (range === '1Y' || range === 'ALL') nextDay.setMonth(nextDay.getMonth() + 1)
    else if (range === '6M') nextDay.setDate(nextDay.getDate() + 7)
    else nextDay.setDate(nextDay.getDate() + 1)
    return (orders ?? []).filter((o) => new Date(o.created_at) >= day && new Date(o.created_at) < nextDay)
      .reduce((s, o) => s + (o.total_amount ?? 0) - (o.discount_amount ?? 0), 0)
  })

  const discountValues = chartDates.map((day) => {
    const nextDay = new Date(day)
    if (range === '1Y' || range === 'ALL') nextDay.setMonth(nextDay.getMonth() + 1)
    else if (range === '6M') nextDay.setDate(nextDay.getDate() + 7)
    else nextDay.setDate(nextDay.getDate() + 1)
    return (orders ?? []).filter((o) => new Date(o.created_at) >= day && new Date(o.created_at) < nextDay)
      .reduce((s, o) => s + (o.discount_amount ?? 0), 0)
  })

  // Table rows per period
  const tableRows = chartDates.map((day, i) => {
    const nextDay = new Date(day)
    if (range === '1Y' || range === 'ALL') nextDay.setMonth(nextDay.getMonth() + 1)
    else if (range === '6M') nextDay.setDate(nextDay.getDate() + 7)
    else nextDay.setDate(nextDay.getDate() + 1)

    const periodOrders = (orders ?? []).filter((o) => new Date(o.created_at) >= day && new Date(o.created_at) < nextDay)
    const gross = periodOrders.reduce((s, o) => s + (o.subtotal ?? 0), 0)
    const discount = periodOrders.reduce((s, o) => s + (o.discount_amount ?? 0), 0)
    const net = periodOrders.reduce((s, o) => s + (o.total_amount ?? 0) - (o.discount_amount ?? 0), 0)
    const shipping = periodOrders.reduce((s, o) => s + (o.shipping_amount ?? 0), 0)

    return {
      id: `rev-${i}`,
      cells: {
        date: chartLabels[i],
        gross: gross > 0 ? `₹${gross.toLocaleString('en-IN')}` : '—',
        discount: discount > 0 ? `₹${discount.toLocaleString('en-IN')}` : '—',
        shipping: shipping > 0 ? `₹${shipping.toLocaleString('en-IN')}` : 'Free',
        net: net > 0 ? `₹${net.toLocaleString('en-IN')}` : '—',
        orders: periodOrders.length > 0 ? String(periodOrders.length) : '—',
      },
    }
  }).filter((r) => r.cells.orders !== '—')

  const totalGross = (orders ?? []).reduce((s, o) => s + (o.subtotal ?? 0), 0)
  const totalDiscount = (orders ?? []).reduce((s, o) => s + (o.discount_amount ?? 0), 0)
  const totalNet = (orders ?? []).reduce((s, o) => s + (o.total_amount ?? 0) - (o.discount_amount ?? 0), 0)
  const totalShipping = (orders ?? []).reduce((s, o) => s + (o.shipping_amount ?? 0), 0)

  tableRows.push({
    id: 'total',
    cells: {
      date: 'TOTAL',
      gross: `₹${totalGross.toLocaleString('en-IN')}`,
      discount: totalDiscount > 0 ? `₹${totalDiscount.toLocaleString('en-IN')}` : '—',
      shipping: totalShipping > 0 ? `₹${totalShipping.toLocaleString('en-IN')}` : 'Free',
      net: `₹${totalNet.toLocaleString('en-IN')}`,
      orders: String(orders?.length ?? 0),
    },
  })

  return { chartLabels, grossValues, netValues, discountValues, tableRows, totalGross, totalNet, totalDiscount }
}

// ── Orders analytics ──────────────────────────────────
export async function getOrdersAnalytics(range = '30D') {
  const supabase = createAdminClient()
  const from = getFromDate(range)

  let query = supabase
    .from('orders')
    .select('id, order_number, total_amount, status, payment_status, provider, created_at')

  if (from) query = query.gte('created_at', from)
  const { data: orders } = await query

  const chartDates = getChartDates(range)
  const chartLabels = chartDates.map((d) => formatChartLabel(d, range))

  const orderValues = chartDates.map((day) => {
    const nextDay = new Date(day)
    if (range === '1Y' || range === 'ALL') nextDay.setMonth(nextDay.getMonth() + 1)
    else if (range === '6M') nextDay.setDate(nextDay.getDate() + 7)
    else nextDay.setDate(nextDay.getDate() + 1)
    return (orders ?? []).filter((o) => new Date(o.created_at) >= day && new Date(o.created_at) < nextDay).length
  })

  const aovValues = chartDates.map((day) => {
    const nextDay = new Date(day)
    if (range === '1Y' || range === 'ALL') nextDay.setMonth(nextDay.getMonth() + 1)
    else if (range === '6M') nextDay.setDate(nextDay.getDate() + 7)
    else nextDay.setDate(nextDay.getDate() + 1)
    const periodOrders = (orders ?? []).filter((o) =>
      new Date(o.created_at) >= day && new Date(o.created_at) < nextDay && o.payment_status === 'paid'
    )
    if (periodOrders.length === 0) return 0
    return periodOrders.reduce((s, o) => s + (o.total_amount ?? 0), 0) / periodOrders.length
  })

  // Recent orders table
  const tableRows = (orders ?? [])
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 20)
    .map((o) => ({
      id: o.id,
      cells: {
        order: o.order_number,
        date: new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        amount: o.payment_status === 'paid' ? `₹${(o.total_amount ?? 0).toLocaleString('en-IN')}` : '—',
        status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
        provider: o.provider === 'banian' ? 'Banian City' : 'Gelato',
      },
    }))

  return { chartLabels, orderValues, aovValues, tableRows, totalOrders: orders?.length ?? 0 }
}

// ── Products analytics ────────────────────────────────
export async function getProductsAnalytics(range = '30D') {
  const supabase = createAdminClient()
  const from = getFromDate(range)

  let query = supabase
    .from('order_items')
    .select(`
      product_id, product_name, variant_sku,
      quantity, subtotal,
      orders!inner(payment_status, created_at)
    `)
    .eq('orders.payment_status', 'paid')

  if (from) query = query.gte('orders.created_at', from)
  const { data: items } = await query

  // Aggregate by product
  const productMap = new Map<string, { name: string; qty: number; revenue: number }>()
  for (const item of items ?? []) {
    const existing = productMap.get(item.product_id) ?? { name: item.product_name, qty: 0, revenue: 0 }
    productMap.set(item.product_id, {
      name: item.product_name,
      qty: existing.qty + (item.quantity ?? 0),
      revenue: existing.revenue + (item.subtotal ?? 0),
    })
  }

  const totalQty = [...productMap.values()].reduce((s, p) => s + p.qty, 0)

  const tableRows = [...productMap.entries()]
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 20)
    .map(([id, p], i) => ({
      id,
      cells: {
        rank: String(i + 1).padStart(2, '0'),
        name: p.name,
        qty: String(p.qty),
        revenue: `₹${p.revenue.toLocaleString('en-IN')}`,
        share: totalQty > 0 ? `${((p.qty / totalQty) * 100).toFixed(1)}%` : '0%',
      },
    }))

  // Chart — top 7 products qty
  const top7 = tableRows.slice(0, 7)
  const chartLabels = top7.map((r) => r.cells.name.split(' ').slice(0, 2).join(' '))
  const qtyValues = top7.map((r) => Number(r.cells.qty))

  return { chartLabels, qtyValues, tableRows, totalQty }
}

// ── Category analytics ────────────────────────────────
export async function getCategoryAnalytics(range = '30D') {
  const supabase = createAdminClient()
  const from = getFromDate(range)

  let query = supabase
    .from('order_items')
    .select(`
      quantity, subtotal, product_id,
      orders!inner(payment_status, created_at),
      products!inner(categories(name))
    `)
    .eq('orders.payment_status', 'paid')

  if (from) query = query.gte('orders.created_at', from)
  const { data: items } = await query

  const catMap = new Map<string, { qty: number; revenue: number }>()
  for (const item of items ?? []) {
    const cats = (item.products as { categories?: { name: string } | null })?.categories
    const catName = (Array.isArray(cats) ? cats[0]?.name : cats?.name) ?? 'Uncategorised'
    const existing = catMap.get(catName) ?? { qty: 0, revenue: 0 }
    catMap.set(catName, {
      qty: existing.qty + (item.quantity ?? 0),
      revenue: existing.revenue + (item.subtotal ?? 0),
    })
  }

  const totalQty = [...catMap.values()].reduce((s, c) => s + c.qty, 0)

  const tableRows = [...catMap.entries()]
    .sort((a, b) => b[1].qty - a[1].qty)
    .map(([name, c], i) => ({
      id: name,
      cells: {
        rank: String(i + 1).padStart(2, '0'),
        name,
        qty: String(c.qty),
        revenue: `₹${c.revenue.toLocaleString('en-IN')}`,
        share: totalQty > 0 ? `${((c.qty / totalQty) * 100).toFixed(1)}%` : '0%',
      },
    }))

  const chartLabels = tableRows.slice(0, 6).map((r) => r.cells.name)
  const qtyValues = tableRows.slice(0, 6).map((r) => Number(r.cells.qty))

  return { chartLabels, qtyValues, tableRows, totalQty }
}

// ── Coupons analytics ─────────────────────────────────
export async function getCouponsAnalytics(range = '30D') {
  const supabase = createAdminClient()
  const from = getFromDate(range)

  let query = supabase
    .from('orders')
    .select('discount_amount, total_amount, created_at, payment_status, coupons(code, type, value)')
    .eq('payment_status', 'paid')
    .not('coupon_id', 'is', null)

  if (from) query = query.gte('created_at', from)
  const { data: orders } = await query

  const couponMap = new Map<string, { uses: number; discount: number; revenue: number }>()
  for (const o of orders ?? []) {
    const coupon = Array.isArray(o.coupons) ? o.coupons[0] : o.coupons
    const code = (coupon as { code?: string } | null)?.code ?? 'Unknown'
    const existing = couponMap.get(code) ?? { uses: 0, discount: 0, revenue: 0 }
    couponMap.set(code, {
      uses: existing.uses + 1,
      discount: existing.discount + (o.discount_amount ?? 0),
      revenue: existing.revenue + (o.total_amount ?? 0),
    })
  }

  const tableRows = [...couponMap.entries()]
    .sort((a, b) => b[1].uses - a[1].uses)
    .map(([code, c]) => ({
      id: code,
      cells: {
        code,
        uses: String(c.uses),
        discount: `₹${c.discount.toLocaleString('en-IN')}`,
        revenue: `₹${c.revenue.toLocaleString('en-IN')}`,
      },
    }))

  const chartLabels = tableRows.slice(0, 7).map((r) => r.cells.code)
  const usesValues = tableRows.slice(0, 7).map((r) => Number(r.cells.uses))
  const discountValues = tableRows.slice(0, 7).map((r) =>
    Number(r.cells.discount.replace(/[₹,]/g, ''))
  )

  return { chartLabels, usesValues, discountValues, tableRows }
}