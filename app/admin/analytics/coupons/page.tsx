'use client'

import { useState, useEffect } from 'react'
import { AdminAnalyticsPage } from '@/components/admin/AdminAnalytics'
import { analyticsRanges } from '@/lib/admin/analytics'
import type { AdminAnalyticsScreen } from '@/components/admin/AdminAnalytics'

export default function CouponsAnalyticsPage() {
  const [range, setRange] = useState('30D')
  const [data, setData] = useState<AdminAnalyticsScreen | null>(null)

  useEffect(() => {
    fetch(`/api/admin/analytics?type=coupons&range=${range}`)
      .then((r) => r.json())
      .then((d) => {
        setData({
          eyebrow: 'ANALYTICS',
          title: 'Coupons',
          subtitle: `Coupon performance · ${range}`,
          activeRange: range,
          ranges: analyticsRanges,
          chartTitle: 'COUPON USAGE',
          chartLabels: d.chartLabels,
          series: [
            { label: 'Uses', color: 'var(--gold)', active: true, values: d.usesValues, format: 'number' },
            { label: 'Discount Given', color: 'var(--status-error)', active: true, values: d.discountValues, format: 'currency' },
          ],
          table: {
            title: 'COUPON BREAKDOWN',
            gridTemplateColumns: 'minmax(0,1fr) 80px 140px 140px',
            columns: [
              { key: 'code', label: 'COUPON CODE', font: 'cinzel', tone: 'primary' },
              { key: 'uses', label: 'USES', font: 'cinzel', tone: 'primary', align: 'right' },
              { key: 'discount', label: 'DISCOUNT GIVEN', font: 'cinzel', tone: 'primary', align: 'right' },
              { key: 'revenue', label: 'REVENUE', font: 'cinzel', tone: 'primary', align: 'right' },
            ],
            rows: d.tableRows,
          },
        })
      })
  }, [range])

  if (!data) return <div className="animate-pulse h-[400px] border border-gold/10 bg-[#1E1A2E]" />
  return <AdminAnalyticsPage screen={{ ...data, activeRange: range }} />
}