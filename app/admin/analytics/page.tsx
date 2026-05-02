'use client'

import { useState, useEffect } from 'react'
import { AdminPageHeading } from '@/components/admin/AdminUi'
import { adminCinzel, adminCormorant, adminRaleway } from '@/components/admin/adminFonts'
import { analyticsRanges } from '@/lib/admin/analytics'

const ranges = analyticsRanges

type OverviewData = {
  totalSales: number
  netSales: number
  totalOrders: number
  productsSold: number
  salesTrend: number
  chartLabels: string[]
  netSalesValues: number[]
  orderValues: number[]
}

function MetricCard({ label, value, trend, trendClassName, valueClassName = 'text-text-primary' }: {
  label: string; value: string; trend: string
  trendClassName: string; valueClassName?: string
}) {
  return (
    <article className="border border-gold/10 bg-[#1E1A2E] p-5">
      <p className={`${adminCinzel.className} text-[9px] tracking-[0.28em] text-text-muted`}>{label}</p>
      <p className={`${adminCormorant.className} mt-2.5 text-[36px] font-light leading-none ${valueClassName}`}>{value}</p>
      <p className={`${adminRaleway.className} mt-2.5 text-[12px] font-light ${trendClassName}`}>{trend}</p>
    </article>
  )
}

function LeaderboardCard({ title, rows, nameLabel }: {
  title: string
  rows: { rank: string; name: string; items: string; share: number }[]
  nameLabel: string
}) {
  return (
    <article className="border border-gold/10 bg-[#1E1A2E] p-6">
      <p className={`${adminCinzel.className} text-[10px] tracking-[0.24em] text-gold`}>{title}</p>
      <div className="mt-4 overflow-hidden border border-gold/10">
        <div className={`grid grid-cols-[70px_minmax(0,1fr)_120px_140px] bg-nav px-4 py-2.5 text-[9px] tracking-[0.16em] text-text-muted ${adminCinzel.className}`}>
          <span>RANK</span>
          <span>{nameLabel}</span>
          <span>ITEMS SOLD</span>
          <span>SHARE</span>
        </div>
        {rows.map((row) => (
          <div key={`${title}-${row.rank}`} className="grid grid-cols-[70px_minmax(0,1fr)_120px_140px] items-center gap-3 border-t border-gold/6 px-4 py-3">
            <span className={`${adminCinzel.className} text-[18px] text-gold`}>{row.rank}</span>
            <span className={`${adminRaleway.className} text-[13px] text-text-primary`}>{row.name}</span>
            <span className={`${adminRaleway.className} text-[13px] font-light text-text-primary`}>{row.items}</span>
            <div className="space-y-1.5">
              <div className="h-1.5 bg-gold/10">
                <div className="h-full bg-gold" style={{ width: `${Math.min(row.share, 100)}%` }} />
              </div>
              <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted`}>
                {row.share > 0 ? `${row.share}%` : '—'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export default function AnalyticsOverviewPage() {
  const [activeRange, setActiveRange] = useState('30D')
  const [activeSeries, setActiveSeries] = useState({ netSales: true, orders: true })
  const [chartMode, setChartMode] = useState<'line' | 'bar'>('line')
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/analytics?type=overview&range=${activeRange}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [activeRange])

  const chartLabels = data?.chartLabels ?? []
  const netSalesValues = data?.netSalesValues ?? []
  const orderValues = data?.orderValues ?? []
  const chartWidth = 920
  const chartHeight = 170
  const maxSales = Math.max(...netSalesValues, 1)
  const maxOrders = Math.max(...orderValues, 1)
  const chartStep = chartLabels.length > 1 ? chartWidth / (chartLabels.length - 1) : chartWidth
  const barSlot = chartWidth / (chartLabels.length || 1)
  const barWidth = barSlot * 0.14
  const barGap = barSlot * 0.06

  const salesPoints = netSalesValues.map((v, i) => `${i * chartStep},${chartHeight - (v / maxSales) * chartHeight}`).join(' ')
  const ordersPoints = orderValues.map((v, i) => `${i * chartStep},${chartHeight - (v / maxOrders) * chartHeight}`).join(' ')

  const trend = data?.salesTrend ?? 0
  const trendSign = trend >= 0 ? '↑' : '↓'
  const trendClass = trend >= 0 ? 'text-[var(--status-success)]' : 'text-[var(--status-error)]'

  const metricCards = data ? [
    { label: 'TOTAL SALES', value: `₹${data.totalSales.toLocaleString('en-IN')}`, trend: `${trendSign} ${Math.abs(trend)}% vs last period`, trendClassName: trendClass, valueClassName: 'text-gold' },
    { label: 'NET SALES', value: `₹${data.netSales.toLocaleString('en-IN')}`, trend: `${trendSign} ${Math.abs(trend)}%`, trendClassName: trendClass, valueClassName: 'text-text-primary' },
    { label: 'ORDERS', value: data.totalOrders.toLocaleString('en-IN'), trend: `${data.totalOrders} total`, trendClassName: 'text-text-muted', valueClassName: 'text-text-primary' },
    { label: 'PRODUCTS SOLD', value: `${data.productsSold.toLocaleString('en-IN')} items`, trend: 'units ordered', trendClassName: 'text-text-muted', valueClassName: 'text-text-primary' },
  ] : []

  // Top chart index for tooltip
  const peakIndex = netSalesValues.indexOf(Math.max(...netSalesValues))

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="space-y-5">
        <AdminPageHeading eyebrow="ANALYTICS" title="Overview" />
        <div className="flex flex-wrap items-center gap-2">
          {ranges.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setActiveRange(range)}
              className={`${adminCinzel.className} border px-4 py-2 text-[10px] font-semibold tracking-[0.16em] transition-colors duration-200 ${
                activeRange === range
                  ? 'border-gold bg-gold/12 text-gold'
                  : 'border-gold/12 text-text-muted hover:border-gold/30 hover:text-text-primary'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metric cards */}
      {loading ? (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[120px] animate-pulse border border-gold/10 bg-[#1E1A2E]" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((card) => <MetricCard key={card.label} {...card} />)}
        </div>
      )}

      {/* Chart */}
      <section className="border border-gold/10 bg-[#1E1A2E] p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className={`${adminCinzel.className} text-[10px] tracking-[0.24em] text-gold`}>NET SALES & ORDERS</p>
          <div className="flex gap-2">
            {(['line', 'bar'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setChartMode(mode)}
                className={`${adminCinzel.className} border px-4 py-1.5 text-[10px] font-semibold tracking-[0.14em] transition-colors duration-200 ${
                  chartMode === mode ? 'border-gold bg-gold/12 text-gold' : 'border-gold/12 text-text-muted hover:border-gold/30'
                }`}
              >
                {mode === 'line' ? 'Line' : 'Bar'}
              </button>
            ))}
          </div>
        </div>

        <div className={`mt-4 flex flex-wrap items-center gap-3 text-[12px] ${adminRaleway.className}`}>
          {[
            { key: 'netSales', label: 'Net Sales', color: 'bg-gold', active: activeSeries.netSales },
            { key: 'orders', label: 'Orders', color: 'bg-[var(--status-info)]', active: activeSeries.orders },
          ].map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActiveSeries((c) => {
                const next = !c[s.key as keyof typeof c]
                if (!next && !c[s.key === 'netSales' ? 'orders' : 'netSales']) return c
                return { ...c, [s.key]: next }
              })}
              className={`inline-flex items-center gap-2 border px-4 py-2 transition-colors duration-200 ${
                s.active ? 'border-gold bg-gold/10 text-text-primary' : 'border-gold/20 bg-[var(--bg-secondary)] text-text-muted'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${s.color}`} />
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-4 w-full border border-gold/10 bg-footer px-2 py-3.5">
          <div className="w-full">
            <div className="relative h-[240px]">
              <div className="pointer-events-none absolute inset-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="absolute left-0 right-0 border-t border-gold/6" style={{ top: `${i * 25}%` }} />
                ))}
              </div>

              {!loading && (
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="absolute inset-x-0 top-4 h-[170px] w-full"
                  preserveAspectRatio="none"
                >
                  {chartMode === 'line' ? (
                    <>
                      {activeSeries.netSales && (
                        <>
                          <polyline fill="none" stroke="#E6C979" strokeWidth="2" points={salesPoints} />
                          {netSalesValues.map((v, i) => (
                            <circle key={i} cx={i * chartStep} cy={chartHeight - (v / maxSales) * chartHeight} r="3" fill="var(--gold)" />
                          ))}
                        </>
                      )}
                      {activeSeries.orders && (
                        <>
                          <polyline fill="none" stroke="var(--status-info)" strokeWidth="1.5" points={ordersPoints} />
                          {orderValues.map((v, i) => (
                            <circle key={i} cx={i * chartStep} cy={chartHeight - (v / maxOrders) * chartHeight} r="2.5" fill="var(--status-info)" />
                          ))}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {netSalesValues.map((v, i) => {
                        const groupStart = i * barSlot + (barSlot - (barWidth * 2 + barGap)) / 2
                        const bh = (v / maxSales) * chartHeight
                        return activeSeries.netSales ? (
                          <rect key={i} x={groupStart} y={chartHeight - bh} width={barWidth} height={bh} fill="var(--gold)" opacity={0.85} />
                        ) : null
                      })}
                      {orderValues.map((v, i) => {
                        const groupStart = i * barSlot + (barSlot - (barWidth * 2 + barGap)) / 2
                        const bh = (v / maxOrders) * chartHeight
                        return activeSeries.orders ? (
                          <rect key={i} x={groupStart + barWidth + barGap} y={chartHeight - bh} width={barWidth} height={bh} fill="var(--status-info)" opacity={0.75} />
                        ) : null
                      })}
                    </>
                  )}
                </svg>
              )}

              {!loading && peakIndex >= 0 && (
                <div className="absolute right-4 top-4 w-[190px] border border-gold/20 bg-nav px-3 py-2">
                  <p className={`${adminRaleway.className} text-[10px] font-light text-text-muted`}>
                    {chartLabels[peakIndex]}
                  </p>
                  {activeSeries.netSales && (
                    <p className={`${adminCinzel.className} mt-1 text-[12px] text-gold`}>
                      Net Sales: ₹{netSalesValues[peakIndex]?.toLocaleString('en-IN')}
                    </p>
                  )}
                  {activeSeries.orders && (
                    <p className={`${adminCinzel.className} mt-1 text-[12px] text-[var(--status-info)]`}>
                      Orders: {orderValues[peakIndex]}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div
              className={`mt-3 grid gap-1 text-center text-[11px] text-text-muted ${adminRaleway.className}`}
              style={{ gridTemplateColumns: `repeat(${chartLabels.length || 6}, minmax(0, 1fr))` }}
            >
              {chartLabels.map((label) => <span key={label}>{label}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboards */}
      <LeaderboardsSection range={activeRange} />
    </div>
  )
}

function LeaderboardsSection({ range }: { range: string }) {
  const [catData, setCatData] = useState<{ tableRows: { id: string; cells: Record<string, string> }[] } | null>(null)
  const [prodData, setProdData] = useState<{ tableRows: { id: string; cells: Record<string, string> }[] } | null>(null)

  useEffect(() => {
    fetch(`/api/admin/analytics?type=category&range=${range}`).then((r) => r.json()).then(setCatData)
    fetch(`/api/admin/analytics?type=products&range=${range}`).then((r) => r.json()).then(setProdData)
  }, [range])

  const catRows = (catData?.tableRows ?? []).slice(0, 5).map((r) => ({
    rank: r.cells.rank,
    name: r.cells.name,
    items: r.cells.qty + ' items',
    share: parseFloat(r.cells.share),
  }))

  const prodRows = (prodData?.tableRows ?? []).slice(0, 5).map((r) => ({
    rank: r.cells.rank,
    name: r.cells.name,
    items: r.cells.qty + ' items',
    share: parseFloat(r.cells.share),
  }))

  // Fill empty rows
  while (catRows.length < 5) catRows.push({ rank: String(catRows.length + 1).padStart(2, '0'), name: '—', items: '0 items', share: 0 })
  while (prodRows.length < 5) prodRows.push({ rank: String(prodRows.length + 1).padStart(2, '0'), name: '—', items: '0 items', share: 0 })

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <LeaderboardCard title="TOP CATEGORIES — ITEMS SOLD" rows={catRows} nameLabel="CATEGORY" />
      <LeaderboardCard title="TOP PRODUCTS — ITEMS SOLD" rows={prodRows} nameLabel="PRODUCT" />
    </div>
  )
}