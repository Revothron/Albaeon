'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { AdminAnalyticsPage } from '@/components/admin/AdminAnalytics'
import { analyticsRanges } from '@/lib/admin/analytics'
import type { AdminAnalyticsScreen } from '@/components/admin/AdminAnalytics'

export default function RevenueAnalyticsPage() {
  const [range, setRange] = useState('30D')
  const [data, setData] = useState<AdminAnalyticsScreen | null>(null)

  useEffect(() => {
    fetch(`/api/admin/analytics?type=revenue&range=${range}`)
      .then((r) => r.json())
      .then((d) => {
        setData({
          eyebrow: 'ANALYTICS',
          title: 'Revenue',
          subtitle: `Revenue breakdown · ${range}`,
          activeRange: range,
          ranges: analyticsRanges,
          chartTitle: 'GROSS vs NET REVENUE',
          chartLabels: d.chartLabels,
          series: [
            { label: 'Gross', color: '#E6C979', active: true, values: d.grossValues, format: 'currency' },
            { label: 'Net', color: '#4CAF7D', active: true, values: d.netValues, format: 'currency' },
            { label: 'Discount', color: '#C0392B', active: false, values: d.discountValues, format: 'currency' },
          ],
          table: {
            title: 'REVENUE BREAKDOWN',
            searchPlaceholder: 'Search by date...',
            reportOptions: ['Export CSV', 'Export PDF'],
            columns: [
              { key: 'date', label: 'DATE', font: 'raleway', tone: 'muted' },
              { key: 'gross', label: 'GROSS', font: 'cinzel', tone: 'primary', align: 'right' },
              { key: 'discount', label: 'DISCOUNT', font: 'raleway', tone: 'muted', align: 'right' },
              { key: 'shipping', label: 'SHIPPING', font: 'raleway', tone: 'muted', align: 'right' },
              { key: 'net', label: 'NET', font: 'cinzel', tone: 'primary', align: 'right' },
              { key: 'orders', label: 'ORDERS', font: 'cinzel', tone: 'primary', align: 'right' },
            ],
            rows: d.tableRows,
          },
        })
      })
  }, [range])

  if (!data) return <div className="animate-pulse h-[400px] border border-gold/10 bg-[#1E1A2E]" />

  return <AdminAnalyticsPage screen={{ ...data, activeRange: range }} onRangeChange={setRange} />
}