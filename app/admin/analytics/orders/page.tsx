'use client'

import { useState, useEffect } from 'react'
import { AdminAnalyticsPage } from '@/components/admin/AdminAnalytics'
import { analyticsRanges } from '@/lib/admin/analytics'
import type { AdminAnalyticsScreen } from '@/components/admin/AdminAnalytics'

export default function OrdersAnalyticsPage() {
  const [range, setRange] = useState('30D')
  const [data, setData] = useState<AdminAnalyticsScreen | null>(null)

  useEffect(() => {
    fetch(`/api/admin/analytics?type=orders&range=${range}`)
      .then((r) => r.json())
      .then((d) => {
        setData({
          eyebrow: 'ANALYTICS',
          title: 'Orders',
          subtitle: `Order trends · ${range}`,
          activeRange: range,
          ranges: analyticsRanges,
          chartTitle: 'ORDERS & AOV',
          chartLabels: d.chartLabels,
          series: [
            { label: 'Orders', color: 'var(--gold)', active: true, values: d.orderValues, format: 'number' },
            { label: 'AOV', color: 'var(--status-info)', active: true, values: d.aovValues, format: 'currency' },
          ],
          table: {
            title: 'RECENT ORDERS',
            searchPlaceholder: 'Search orders...',
            reportOptions: ['Export CSV'],
            columns: [
              { key: 'order', label: 'ORDER ID', font: 'cinzel', tone: 'primary' },
              { key: 'date', label: 'DATE', font: 'raleway', tone: 'muted' },
              { key: 'amount', label: 'AMOUNT', font: 'cinzel', tone: 'primary', align: 'right' },
              { key: 'status', label: 'STATUS', font: 'raleway', tone: 'muted' },
              { key: 'provider', label: 'PROVIDER', font: 'raleway', tone: 'muted' },
            ],
            rows: d.tableRows,
          },
        })
      })
  }, [range])

  if (!data) return <div className="animate-pulse h-[400px] border border-gold/10 bg-[#1E1A2E]" />
  return <AdminAnalyticsPage screen={{ ...data, activeRange: range }} />
}