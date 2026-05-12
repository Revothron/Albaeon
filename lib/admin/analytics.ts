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

function getPeriodArg(range: string): string {
  if (range === '1Y' || range === 'ALL') return 'month'
  if (range === '6M') return 'week'
  return 'day'
}

function formatLabel(d: Date, range: string): string {
  if (range === '1Y' || range === 'ALL' || range === '6M') {
    return d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
  }
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

// ── Overview analytics ────────────────────────────────
export async function getAnalyticsOverview(range = '30D') {
  const supabase = createAdminClient()
  const from = getFromDate(range)
  const now = new Date().toISOString()

  // PERF: replaced broken .sum() aggregates with single RPC

  const periodMs = from ? Date.now() - new Date(from).getTime() : 0
  const prevFrom = from ? new Date(new Date(from).getTime() - periodMs).toISOString() : null

  const { data: totalsData } = await supabase
    .rpc('get_overview_totals', {
      from_date: from ?? null,
      prev_from_date: prevFrom ?? null,
    })

  const totals = (totalsData as { total_sales: number; total_discount: number; total_orders: number; prev_sales: number }[] | null)?.[0]
  const totalSales = Number(totals?.total_sales ?? 0)
  const totalDiscount = Number(totals?.total_discount ?? 0)
  const totalOrders = Number(totals?.total_orders ?? 0)
  const netSales = totalSales - totalDiscount
  const prevSales = Number(totals?.prev_sales ?? 0)
  const salesTrend = prevSales > 0 ? ((totalSales - prevSales) / prevSales * 100).toFixed(1) : '0'

  // Products sold via RPC
  const { data: productsSoldData } = await supabase
    .rpc('get_products_sold_count', {
      from_date: from ?? null,
      to_date: now,
    })
  const productsSold = Number(productsSoldData ?? 0)

  // Chart data via RPC (Pattern 2)
  const period = getPeriodArg(range)
  const { data: periodData } = await supabase
    .rpc('get_revenue_breakdown', {
      from_date: from ?? null,
      to_date: now,
      period,
    })

  const rows = (periodData ?? []) as { period_start: string; net: number; order_count: number }[]
  const chartLabels = rows.map((r) => formatLabel(new Date(r.period_start), range))
  const netSalesValues = rows.map((r) => Number(r.net ?? 0))
  const orderValues = rows.map((r) => Number(r.order_count ?? 0))

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
  const now = new Date().toISOString()

  // PERF: aggregation moved to SQL — was loading all rows into JS memory
  const period = getPeriodArg(range)
  const { data: periodData } = await supabase
    .rpc('get_revenue_breakdown', {
      from_date: from ?? null,
      to_date: now,
      period,
    })

  const rows = (periodData ?? []) as {
    period_start: string; gross: number; discounts: number; shipping: number; net: number; order_count: number
  }[]

  const chartLabels = rows.map((r) => formatLabel(new Date(r.period_start), range))
  const grossValues = rows.map((r) => Number(r.gross ?? 0))
  const netValues = rows.map((r) => Number(r.net ?? 0))
  const discountValues = rows.map((r) => Number(r.discounts ?? 0))

  // Table rows per period
  const tableRows = rows.map((r, i) => ({
    id: `rev-${i}`,
    cells: {
      date: chartLabels[i],
      gross: r.gross > 0 ? `₹${r.gross.toLocaleString('en-IN')}` : '—',
      discount: r.discounts > 0 ? `₹${r.discounts.toLocaleString('en-IN')}` : '—',
      shipping: r.shipping > 0 ? `₹${r.shipping.toLocaleString('en-IN')}` : 'Free',
      net: r.net > 0 ? `₹${r.net.toLocaleString('en-IN')}` : '—',
      orders: r.order_count > 0 ? String(r.order_count) : '—',
    },
  })).filter((r) => r.cells.orders !== '—')

  const totalGross = rows.reduce((s, r) => s + Number(r.gross ?? 0), 0)
  const totalDiscount = rows.reduce((s, r) => s + Number(r.discounts ?? 0), 0)
  const totalNet = rows.reduce((s, r) => s + Number(r.net ?? 0), 0)
  const totalShipping = rows.reduce((s, r) => s + Number(r.shipping ?? 0), 0)

  tableRows.push({
    id: 'total',
    cells: {
      date: 'TOTAL',
      gross: `₹${totalGross.toLocaleString('en-IN')}`,
      discount: totalDiscount > 0 ? `₹${totalDiscount.toLocaleString('en-IN')}` : '—',
      shipping: totalShipping > 0 ? `₹${totalShipping.toLocaleString('en-IN')}` : 'Free',
      net: `₹${totalNet.toLocaleString('en-IN')}`,
      orders: String(rows.reduce((s, r) => s + Number(r.order_count ?? 0), 0)),
    },
  })

  return { chartLabels, grossValues, netValues, discountValues, tableRows, totalGross, totalNet, totalDiscount }
}

// ── Orders analytics ──────────────────────────────────
export async function getOrdersAnalytics(range = '30D') {
  const supabase = createAdminClient()
  const from = getFromDate(range)
  const now = new Date().toISOString()

  // PERF: aggregation moved to SQL — was loading all rows into JS memory

  // Order count per period (all statuses) via RPC
  const period = getPeriodArg(range)
  const { data: countData } = await supabase
    .rpc('get_order_count_by_period', {
      from_date: from ?? null,
      to_date: now,
      period,
    })

  const countRows = (countData ?? []) as { period_start: string; order_count: number }[]
  const chartLabels = countRows.map((r) => formatLabel(new Date(r.period_start), range))
  const orderValues = countRows.map((r) => Number(r.order_count ?? 0))

  // AOV per period (paid orders only) via RPC
  const { data: revenueData } = await supabase
    .rpc('get_revenue_by_period', {
      from_date: from ?? null,
      to_date: now,
      period,
    })

  const revRows = (revenueData ?? []) as { period_start: string; revenue: number; order_count: number }[]
  const revByPeriod = new Map(revRows.map((r) => [r.period_start, r]))
  const aovValues = countRows.map((r) => {
    const match = revByPeriod.get(r.period_start)
    if (!match || match.order_count === 0) return 0
    return Number(match.revenue ?? 0) / Number(match.order_count)
  })

  // Recent orders table — only fetch most recent 20
  let recentQuery = supabase
    .from('orders')
    .select('id, order_number, total_amount, status, payment_status, provider, created_at')

  if (from) recentQuery = recentQuery.gte('created_at', from)
  const { data: recentOrders } = await recentQuery
    .order('created_at', { ascending: false })
    .limit(20)

  const tableRows = (recentOrders ?? []).map((o) => ({
    id: o.id,
    cells: {
      order: o.order_number,
      date: new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      amount: o.payment_status === 'paid' ? `₹${(o.total_amount ?? 0).toLocaleString('en-IN')}` : '—',
      status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
      provider: o.provider === 'banian' ? 'Banian City' : 'Gelato',
    },
  }))

  const totalOrders = countRows.reduce((s, r) => s + Number(r.order_count ?? 0), 0)

  return { chartLabels, orderValues, aovValues, tableRows, totalOrders }
}

// ── Products analytics ────────────────────────────────
export async function getProductsAnalytics(range = '30D') {
  const supabase = createAdminClient()
  const from = getFromDate(range)
  const now = new Date().toISOString()

  // PERF: aggregation moved to SQL — was loading all rows into JS memory
  const { data: topProducts } = await supabase
    .rpc('get_top_products', {
      from_date: from ?? null,
      to_date: now,
      row_limit: 20,
    })

  const items = (topProducts ?? []) as {
    product_id: string; product_name: string; total_sold: number; total_revenue: number
  }[]

  const totalQty = items.reduce((s, p) => s + Number(p.total_sold ?? 0), 0)

  const tableRows = items.map((p, i) => ({
    id: p.product_id,
    cells: {
      rank: String(i + 1).padStart(2, '0'),
      name: p.product_name,
      qty: String(p.total_sold ?? 0),
      revenue: `₹${(p.total_revenue ?? 0).toLocaleString('en-IN')}`,
      share: totalQty > 0 ? `${((Number(p.total_sold ?? 0) / totalQty) * 100).toFixed(1)}%` : '0%',
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
  const now = new Date().toISOString()

  // PERF: aggregation moved to SQL — was loading all rows into JS memory
  const { data: catData } = await supabase
    .rpc('get_category_stats', {
      from_date: from ?? null,
      to_date: now,
    })

  const items = (catData ?? []) as {
    category_name: string; total_sold: number; total_revenue: number
  }[]

  const totalQty = items.reduce((s, c) => s + Number(c.total_sold ?? 0), 0)

  const tableRows = items.map((c, i) => ({
    id: c.category_name,
    cells: {
      rank: String(i + 1).padStart(2, '0'),
      name: c.category_name,
      qty: String(c.total_sold ?? 0),
      revenue: `₹${(c.total_revenue ?? 0).toLocaleString('en-IN')}`,
      share: totalQty > 0 ? `${((Number(c.total_sold ?? 0) / totalQty) * 100).toFixed(1)}%` : '0%',
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
  const now = new Date().toISOString()

  // PERF: aggregation moved to SQL — was loading all rows into JS memory
  const { data: couponData } = await supabase
    .rpc('get_coupon_usage_stats', {
      from_date: from ?? null,
      to_date: now,
    })

  const items = (couponData ?? []) as {
    coupon_code: string; uses_count: number; total_discount: number; total_revenue: number
  }[]

  const tableRows = items.map((c) => ({
    id: c.coupon_code,
    cells: {
      code: c.coupon_code,
      uses: String(c.uses_count ?? 0),
      discount: `₹${(c.total_discount ?? 0).toLocaleString('en-IN')}`,
      revenue: `₹${(c.total_revenue ?? 0).toLocaleString('en-IN')}`,
    },
  }))

  const chartLabels = tableRows.slice(0, 7).map((r) => r.cells.code)
  const usesValues = tableRows.slice(0, 7).map((r) => Number(r.cells.uses))
  const discountValues = tableRows.slice(0, 7).map((r) =>
    Number(r.cells.discount.replace(/[₹,]/g, ''))
  )

  return { chartLabels, usesValues, discountValues, tableRows }
}
