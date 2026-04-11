import { createAdminClient } from '@/lib/supabase/admin'

export async function getDashboardStats() {
  const supabase = createAdminClient()

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString()

  // Total orders
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('payment_status', 'paid')

  // This month revenue
  const { data: thisMonthOrders } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('payment_status', 'paid')
    .gte('created_at', startOfMonth)

  const thisMonthRevenue = (thisMonthOrders ?? []).reduce(
    (sum, o) => sum + (o.total_amount ?? 0), 0
  )

  // Last month revenue
  const { data: lastMonthOrders } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('payment_status', 'paid')
    .gte('created_at', startOfLastMonth)
    .lte('created_at', endOfLastMonth)

  const lastMonthRevenue = (lastMonthOrders ?? []).reduce(
    (sum, o) => sum + (o.total_amount ?? 0), 0
  )

  const revenueTrend = lastMonthRevenue > 0
    ? `${((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)}%`
    : '+0%'

  // Pending orders
  const { count: pendingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'processing'])

  // Today's orders
  const { count: todayOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfToday)

  // Recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      total_amount,
      status,
      payment_status,
      created_at,
      profiles (email, first_name, last_name)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  // Quick stats
  const { count: banianOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('provider', 'banian')

  const { count: gelatoOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('provider', 'gelato')

  const { count: activeCoupons } = await supabase
    .from('coupons')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { count: openTickets } = await supabase
    .from('support_tickets')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'unread')

  const { count: activeProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: draftProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft')

  // Last 7 days chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d
  })

  const chartData = await Promise.all(
    last7Days.map(async (day) => {
      const start = new Date(day.getFullYear(), day.getMonth(), day.getDate()).toISOString()
      const end = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1).toISOString()

      const { data: dayOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'paid')
        .gte('created_at', start)
        .lt('created_at', end)

      const revenue = (dayOrders ?? []).reduce((sum, o) => sum + (o.total_amount ?? 0), 0)
      const count = dayOrders?.length ?? 0

      return {
        date: day.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        revenue,
        orders: count,
      }
    })
  )

  return {
    totalOrders: totalOrders ?? 0,
    thisMonthRevenue,
    revenueTrend,
    pendingOrders: pendingOrders ?? 0,
    todayOrders: todayOrders ?? 0,
    recentOrders: (recentOrders ?? []).map((o) => {
      const profile = o.profiles as { email?: string; first_name?: string; last_name?: string } | null
      const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || profile?.email || 'Guest'
      return {
        id: o.order_number,
        customer: name,
        amount: `₹${(o.total_amount ?? 0).toLocaleString('en-IN')}`,
        status: o.status === 'delivered' ? 'Fulfilled'
          : o.status === 'shipped' ? 'Accepted'
          : o.status === 'processing' ? 'Processing'
          : 'Draft',
        date: new Date(o.created_at).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric',
        }),
      }
    }),
    quickStats: {
      banianOrders: banianOrders ?? 0,
      gelatoOrders: gelatoOrders ?? 0,
      activeCoupons: activeCoupons ?? 0,
      openTickets: openTickets ?? 0,
      activeProducts: activeProducts ?? 0,
      draftProducts: draftProducts ?? 0,
    },
    chartData,
  }
}