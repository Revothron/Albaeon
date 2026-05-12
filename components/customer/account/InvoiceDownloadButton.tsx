'use client'

import { useState } from 'react'
import { Cinzel } from 'next/font/google'
import { Download } from 'lucide-react'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['600'] })

export default function InvoiceDownloadButton({
  orderNumber,
}: {
  orderNumber: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleDownload() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(
        `/api/orders/invoice?order=${encodeURIComponent(orderNumber)}`
      )

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Failed to generate invoice')
        setLoading(false)
        return
      }

      // Trigger download
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Albaeon-Invoice-${orderNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch {
      setError('Download failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 border border-gold/30 px-4 py-3 font-sans text-[13px] text-gold transition-colors hover:border-gold hover:bg-gold/5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="h-3.5 w-3.5" strokeWidth={2} />
        {loading ? 'Generating Invoice...' : 'Download Invoice (PDF)'}
      </button>
      {error && (
        <p className="font-sans text-[12px] text-[var(--status-error)]">
          {error}
        </p>
      )}
    </div>
  )
}