import Link from 'next/link'
import { ChevronRight, CalendarDays, ClipboardList, Hourglass, Wallet } from 'lucide-react'
import { adminCinzel, adminCormorant, adminRaleway } from '@/components/admin/adminFonts'
import { getDashboardStats } from '@/lib/admin/dashboard'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const statusClassNames: Record<string, string> = {
  Accepted: 'border-[var(--status-info)]/35 bg-[var(--status-info)]/12 text-[var(--status-info)]',
  Fulfilled: 'border-[var(--status-success)]/35 bg-[var(--status-success)]/12 text-[var(--status-success)]',
  Processing: 'border-[var(--status-warning)]/35 bg-[var(--status-warning)]/12 text-[var(--status-warning)]',
  Draft: 'border-white/15 bg-white/6 text-text-muted',
}

export default async function AdminDashboard() {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  const stats = await getDashboardStats()

  const statCards = [
    {
      label: 'TOTAL ORDERS',
      value: stats.totalOrders.toLocaleString('en-IN'),
      trend: '+12%',
      trendSubtext: 'vs last month',
      Icon: ClipboardList,
      accentClassName: 'text-text-primary',
      progressClassName: 'bg-[var(--status-success)]',
      progressTrackClassName: 'bg-[var(--status-success)]/25',
      progressWidth: '68%',
    },
    {
      label: 'TOTAL REVENUE',
      value: `₹${stats.thisMonthRevenue.toLocaleString('en-IN')}`,
      trend: stats.revenueTrend.startsWith('-') ? stats.revenueTrend : `+${stats.revenueTrend}`,
      trendSubtext: 'vs last month',
      Icon: Wallet,
      accentClassName: 'text-gold',
      progressClassName: 'bg-[var(--status-success)]',
      progressTrackClassName: 'bg-[var(--status-success)]/25',
      progressWidth: '62%',
    },
    {
      label: 'PENDING ORDERS',
      value: stats.pendingOrders.toString(),
      trend: `${stats.pendingOrders > 0 ? '+' : ''}${stats.pendingOrders}`,
      trendSubtext: 'need attention',
      Icon: Hourglass,
      accentClassName: 'text-[var(--status-warning)]',
      progressClassName: 'bg-[var(--status-warning)]',
      progressTrackClassName: 'bg-[var(--status-warning)]/25',
      progressWidth: '28%',
    },
    {
      label: "TODAY'S ORDERS",
      value: stats.todayOrders.toString(),
      trend: `+${stats.todayOrders}`,
      trendSubtext: 'today',
      Icon: CalendarDays,
      accentClassName: 'text-text-primary',
      progressClassName: 'bg-[var(--status-success)]',
      progressTrackClassName: 'bg-[var(--status-success)]/25',
      progressWidth: '42%',
    },
  ]

  const quickStats = [
    { label: 'Banian Orders', value: stats.quickStats.banianOrders.toString(), valueClassName: 'text-text-primary' },
    { label: 'Gelato Orders', value: stats.quickStats.gelatoOrders.toString(), valueClassName: 'text-text-primary' },
    { label: 'Active Coupons', value: stats.quickStats.activeCoupons.toString(), valueClassName: 'text-text-primary' },
    { label: 'Open Support Tickets', value: stats.quickStats.openTickets.toString(), valueClassName: stats.quickStats.openTickets > 0 ? 'text-[var(--status-error)]' : 'text-text-primary' },
    { label: 'Products Active', value: stats.quickStats.activeProducts.toString(), valueClassName: 'text-text-primary' },
    { label: 'Products Draft', value: stats.quickStats.draftProducts.toString(), valueClassName: 'text-text-muted' },
  ]

  // Chart data
  const chartDates = stats.chartData.map((d) => d.date)
  const revenueValues = stats.chartData.map((d) => d.revenue)
  const orderValues = stats.chartData.map((d) => d.orders)
  const chartWidth = 760
  const chartHeight = 180
  const maxRevenue = Math.max(...revenueValues, 1)
  const maxOrders = Math.max(...orderValues, 1)
  const chartStep = chartWidth / (chartDates.length - 1)
  const highlightedIndex = revenueValues.indexOf(Math.max(...revenueValues))

  const revenuePoints = revenueValues
    .map((value, i) => `${i * chartStep},${chartHeight - (value / maxRevenue) * chartHeight}`)
    .join(' ')

  const orderPoints = orderValues
    .map((value, i) => `${i * chartStep},${chartHeight - (value / maxOrders) * chartHeight}`)
    .join(' ')

  const highlightedX = highlightedIndex * chartStep

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className={`${adminCinzel.className} text-[9px] tracking-[0.38em] text-text-muted`}>OVERVIEW</p>
          <h1 className={`${adminCormorant.className} mt-1 text-[30px] font-light leading-none text-text-primary sm:text-[32px]`}>
            Dashboard
          </h1>
          <p className={`${adminRaleway.className} mt-2 text-[13px] font-light text-text-muted`}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className={`${adminCinzel.className} inline-flex items-center justify-center bg-gold px-5 py-2.5 text-[10px] font-semibold tracking-[0.18em] text-nav transition-colors duration-200 hover:bg-gold-hover`}
        >
          + New Product
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.Icon
          return (
            <div key={card.label} className="card-hover border border-gold/10 bg-[#1E1A2E] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className={`${adminCinzel.className} text-[9px] tracking-[0.28em] text-text-muted`}>{card.label}</p>
                <Icon className="h-4 w-4 text-text-muted" strokeWidth={1.8} />
              </div>
              <p className={`${adminCormorant.className} mt-4 text-[36px] font-light leading-none sm:text-[40px] ${card.accentClassName}`}>
                {card.value}
              </p>
              <div className={`mt-3 flex items-center gap-2 ${adminRaleway.className} text-[12px]`}>
                <span className={card.trend.startsWith('+') ? 'text-[var(--status-success)]' : 'text-text-muted'}>
                  {card.trend}
                </span>
                <span className="text-text-muted">{card.trendSubtext}</span>
              </div>
              <div className={`mt-4 h-[2px] w-full ${card.progressTrackClassName}`}>
                <div className={`h-full ${card.progressClassName}`} style={{ width: card.progressWidth }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Chart */}
      <section className="border border-gold/10 bg-[#1E1A2E] p-6 md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className={`${adminCinzel.className} text-[10px] tracking-[0.3em] text-gold`}>SALES OVERVIEW</p>
            <p className={`${adminRaleway.className} mt-1 text-[12px] font-light text-text-muted`}>Revenue performance — last 7 days</p>
          </div>
        </div>

        <div className="mt-6 border border-gold/10 px-4 pb-2.5 pt-4">
          <div className="grid grid-cols-[44px_minmax(0,1fr)_36px] gap-2 md:grid-cols-[56px_minmax(0,1fr)_56px] md:gap-3">
            <div className={`flex h-[210px] flex-col justify-between text-[10px] text-text-muted md:text-[11px] ${adminRaleway.className}`}>
              {['₹100k', '₹80k', '₹60k', '₹40k', '₹20k'].map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>

            <div className="relative h-[210px]">
              <div className="pointer-events-none absolute inset-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="absolute left-0 right-0 border-t border-gold/8" style={{ top: `${i * 25}%` }} />
                ))}
              </div>

              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="absolute inset-x-0 top-4 h-[180px] w-full overflow-visible"
                preserveAspectRatio="none"
              >
                <line x1={highlightedX} y1={0} x2={highlightedX} y2={chartHeight} stroke="rgba(230,201,121,0.25)" strokeWidth="1" />
                <polyline fill="none" stroke="var(--gold)" strokeWidth="2" points={revenuePoints} />
                <polyline fill="none" stroke="var(--status-info)" strokeWidth="1.5" points={orderPoints} />
                {revenueValues.map((value, i) => (
                  <circle key={`r${i}`} cx={i * chartStep} cy={chartHeight - (value / maxRevenue) * chartHeight} r="3.5" fill="var(--gold)" />
                ))}
                {orderValues.map((value, i) => (
                  <circle key={`o${i}`} cx={i * chartStep} cy={chartHeight - (value / maxOrders) * chartHeight} r="2.5" fill="var(--status-info)" />
                ))}
              </svg>

              {revenueValues[highlightedIndex] > 0 && (
                <div
                  className="absolute top-4 w-[138px] border border-gold/20 bg-nav px-3 py-2"
                  style={{ left: `min(calc(${(highlightedX / chartWidth) * 100}% - 36px), calc(100% - 138px))` }}
                >
                  <p className={`${adminRaleway.className} text-[10px] text-text-muted`}>{chartDates[highlightedIndex]}</p>
                  <p className={`${adminCinzel.className} mt-1 text-[12px] text-gold`}>
                    ₹{revenueValues[highlightedIndex].toLocaleString('en-IN')}
                  </p>
                  <p className={`${adminCinzel.className} mt-1 text-[12px] text-[var(--status-info)]`}>
                    Orders: {orderValues[highlightedIndex]}
                  </p>
                </div>
              )}
            </div>

            <div className={`flex h-[210px] flex-col items-end justify-between text-[10px] text-[var(--status-info)] md:text-[11px] ${adminRaleway.className}`}>
              {[maxOrders, Math.round(maxOrders * 0.75), Math.round(maxOrders * 0.5), Math.round(maxOrders * 0.25), '0'].map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>

          <div className={`mt-3 grid grid-cols-7 text-center text-[10px] text-text-muted md:text-[11px] ${adminRaleway.className}`}>
            {chartDates.map((label) => <span key={label}>{label}</span>)}
          </div>
        </div>

        <div className={`mt-5 flex flex-wrap items-center gap-6 text-[12px] text-text-muted ${adminRaleway.className}`}>
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 bg-gold" />Revenue</span>
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 bg-[var(--status-info)]" />Orders</span>
        </div>
      </section>

      {/* Recent Orders + Quick Stats */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="border border-gold/10 bg-[#1E1A2E] p-5 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <p className={`${adminCinzel.className} text-[10px] tracking-[0.3em] text-gold`}>RECENT ORDERS</p>
            <Link href="/admin/orders" className={`${adminCinzel.className} inline-flex items-center gap-1 text-[10px] tracking-[0.18em] text-text-muted transition-colors duration-200 hover:text-gold`}>
              View All <ChevronRight className="h-3 w-3" strokeWidth={1.8} />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className={`${adminRaleway.className} mt-4 text-[13px] text-text-muted`}>No orders yet.</p>
          ) : (
            <div className="mt-5 overflow-x-auto border border-gold/10">
              <table className="w-full min-w-[640px] border-collapse">
                <thead className="bg-nav">
                  <tr className={`${adminCinzel.className} text-[10px] tracking-[0.18em] text-text-muted`}>
                    {['ORDER ID', 'CUSTOMER', 'AMOUNT', 'STATUS', 'DATE'].map((col) => (
                      <th key={col} className="px-4 py-3 text-center font-semibold">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="border-t border-gold/6">
                      <td className={`${adminCinzel.className} px-4 py-3 text-center text-[13px] text-gold`}>{order.id}</td>
                      <td className={`${adminRaleway.className} px-4 py-3 text-center text-[13px] font-light text-text-primary`}>{order.customer}</td>
                      <td className={`${adminCinzel.className} px-4 py-3 text-center text-[13px] text-text-primary`}>{order.amount}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`${adminRaleway.className} inline-flex items-center border px-3 py-1 text-[11px] font-medium ${statusClassNames[order.status] ?? statusClassNames.Draft}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className={`${adminRaleway.className} px-4 py-3 text-center text-[13px] font-light text-text-muted`}>{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="border border-gold/10 bg-[#1E1A2E] p-5 md:p-6">
          <p className={`${adminCinzel.className} text-[10px] tracking-[0.3em] text-gold`}>QUICK STATS</p>
          <div className="mt-4 divide-y divide-gold/6">
            {quickStats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between gap-4 py-3">
                <span className={`${adminRaleway.className} text-[13px] font-light text-text-muted`}>{stat.label}</span>
                <span className={`${adminCinzel.className} text-[14px] ${stat.valueClassName}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}