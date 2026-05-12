'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { AdminAnalyticsPage } from '@/components/admin/AdminAnalytics'
import { analyticsRanges } from '@/lib/admin/analytics'
import type { AdminAnalyticsScreen } from '@/components/admin/AdminAnalytics'

export default function CategoryAnalyticsPage() {
  const [range, setRange] = useState('30D')
  const [data, setData] = useState<AdminAnalyticsScreen | null>(null)

  useEffect(() => {
    fetch(`/api/admin/analytics?type=category&range=${range}`)
      .then((r) => r.json())
      .then((d) => {
        setData({
          eyebrow: 'ANALYTICS',
          title: 'Categories',
          subtitle: `Category breakdown · ${range}`,
          activeRange: range,
          ranges: analyticsRanges,
          chartTitle: 'CATEGORY PERFORMANCE',
          chartLabels: d.chartLabels,
          series: [
            { label: 'Units Sold', color: '#E6C979', active: true, values: d.qtyValues, format: 'number' },
          ],
          table: {
            title: 'CATEGORY BREAKDOWN',
            gridTemplateColumns: '60px minmax(0,1fr) 100px 140px 100px',
            columns: [
              { key: 'rank', label: 'RANK', font: 'cinzel', tone: 'primary' },
              { key: 'name', label: 'CATEGORY', font: 'raleway', tone: 'primary' },
              { key: 'qty', label: 'QTY SOLD', font: 'cinzel', tone: 'primary', align: 'right' },
              { key: 'revenue', label: 'REVENUE', font: 'cinzel', tone: 'primary', align: 'right' },
              { key: 'share', label: 'SHARE', font: 'raleway', tone: 'muted', align: 'right' },
            ],
            rows: d.tableRows,
          },
        })
      })
  }, [range])

  if (!data) return <div className="animate-pulse h-[400px] border border-gold/10 bg-[#1E1A2E]" />
  return <AdminAnalyticsPage screen={{ ...data, activeRange: range }} onRangeChange={setRange} />
}