'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminRaleway } from '@/components/admin/adminFonts'
import { createClient } from '@/lib/supabase/client'

type CustomerData = {
  id: string
  name: string
  email: string
  phone: string
  registered: string
  memberSince: string
  country: string
  city: string
  region: string
  postal: string
  segment: string
  orders: number
  spent: string
  aov: string
  lastOrder: string
  shippingAddress: string[]
  billingAddress: string[]
  orderHistory: {
    id: string
    date: string
    amount: string
    status: string
  }[]
  isBanned?: boolean
}

export default function CustomerActions({
  customer,
}: {
  customer: CustomerData
}) {
  const router = useRouter()
  const supabase = createClient()
  const [banning, setBanning] = useState(false)
  const [banned, setBanned] = useState(customer.isBanned ?? false)
  const [exporting, setExporting] = useState(false)

  // ── Ban / Unban ───────────────────────────────────────
  async function handleBan() {
    const action = banned ? 'unban' : 'ban'
    const confirmed = window.confirm(
      banned
        ? `Unban ${customer.name}? They will regain access to their account.`
        : `Ban ${customer.name}? They will lose access to their account immediately.`
    )
    if (!confirmed) return

    setBanning(true)

    const { error } = await supabase
      .from('profiles')
      .update({ is_active: banned })
      .eq('id', customer.id)

    if (error) {
      alert(`Failed to ${action} account. Please try again.`)
      setBanning(false)
      return
    }

    setBanned(!banned)
    setBanning(false)
    router.refresh()
  }

  // ── Export CSV ────────────────────────────────────────
  function handleExport() {
    setExporting(true)

    try {
      const lines: string[] = []

      // Customer info section
      lines.push('CUSTOMER INFORMATION')
      lines.push(`Name,${customer.name}`)
      lines.push(`Email,${customer.email}`)
      lines.push(`Phone,${customer.phone}`)
      lines.push(`Registered,${customer.registered}`)
      lines.push(`Member Since,${customer.memberSince}`)
      lines.push(`Segment,${customer.segment}`)
      lines.push(`Country,${customer.country}`)
      lines.push(`City,${customer.city}`)
      lines.push(`Region,${customer.region}`)
      lines.push(`Postal,${customer.postal}`)
      lines.push(`Total Orders,${customer.orders}`)
      lines.push(`Total Spent,${customer.spent}`)
      lines.push(`Average Order Value,${customer.aov}`)
      lines.push(`Last Order,${customer.lastOrder}`)
      lines.push('')

      // Shipping address
      lines.push('SHIPPING ADDRESS')
      customer.shippingAddress.forEach((line) => {
        lines.push(line.replace(/,/g, ' '))
      })
      lines.push('')

      // Billing address
      lines.push('BILLING ADDRESS')
      customer.billingAddress.forEach((line) => {
        lines.push(line.replace(/,/g, ' '))
      })
      lines.push('')

      // Order history
      lines.push('ORDER HISTORY')
      lines.push('Order ID,Date,Amount,Status')
      customer.orderHistory.forEach((order) => {
        lines.push(
          `${order.id},${order.date},${order.amount.replace(/,/g, '')},${order.status}`
        )
      })

      const csv = lines.join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `customer-${customer.name.replace(/\s+/g, '-').toLowerCase()}-${customer.id.slice(0, 8)}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch {
      alert('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleBan}
        disabled={banning}
        className={`${adminRaleway.className} flex w-full items-center justify-center border px-4 py-3 text-[13px] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
          banned
            ? 'border-[var(--status-success)] text-[var(--status-success)] hover:bg-[var(--status-success)] hover:text-white'
            : 'border-[var(--status-error)] text-[var(--status-error)] hover:bg-[var(--status-error)] hover:text-white'
        }`}
      >
        {banning
          ? 'Processing...'
          : banned
          ? 'Unban Account'
          : 'Ban Account'}
      </button>

      <button
        type="button"
        onClick={handleExport}
        disabled={exporting}
        className={`${adminRaleway.className} flex w-full items-center justify-center border border-gold/20 px-4 py-3 text-[13px] text-text-muted transition-colors duration-200 hover:border-gold/40 hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {exporting ? 'Exporting...' : 'Export Customer Data'}
      </button>
    </div>
  )
}