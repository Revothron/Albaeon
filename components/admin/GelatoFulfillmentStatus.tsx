'use client'

import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, ExternalLink } from 'lucide-react'
import { adminCinzel, adminRaleway } from '@/components/admin/adminFonts'

type GelatoStatus = {
  fulfillmentStatus: string
  financialStatus: string
  orderedAt: string
  updatedAt: string
  shipment?: {
    shipmentMethodName: string
    minDeliveryDate: string
    maxDeliveryDate: string
    packages: {
      trackingCode: string
      trackingUrl: string
    }[]
  }
  items: {
    id: string
    fulfillmentStatus: string
    productUid: string
  }[]
}

const statusColor: Record<string, string> = {
  created:     '#E6A817',
  uploading:   '#E6A817',
  passed:      '#4A90C4',
  in_production: '#4A90C4',
  printed:     '#4A90C4',
  shipped:     '#E6C979',
  in_transit:  '#E6C979',
  delivered:   '#4CAF7D',
  failed:      '#C0392B',
  canceled:    '#C0392B',
  returned:    '#C0392B',
  on_hold:     '#E6A817',
}

function StatusPill({ status }: { status: string }) {
  const color = statusColor[status] ?? '#B7AFC3'
  return (
    <span
      className={`${adminCinzel.className} inline-flex items-center border px-3 py-1 text-[9px] font-semibold tracking-[0.15em]`}
      style={{ color, borderColor: `${color}50`, backgroundColor: `${color}15` }}
    >
      {status.replace(/_/g, ' ').toUpperCase()}
    </span>
  )
}

export default function GelatoFulfillmentStatus({
  gelatoOrderId,
}: {
  gelatoOrderId: string
}) {
  const [data, setData] = useState<GelatoStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  const fetchStatus = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/gelato/order?id=${encodeURIComponent(gelatoOrderId)}`)
      const json = await res.json()
      if (json.error) {
        setError(json.error)
      } else {
        setData(json.data)
        setLastFetched(new Date())
      }
    } catch {
      setError('Failed to fetch Gelato status')
    } finally {
      setLoading(false)
    }
  }, [gelatoOrderId])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  if (loading && !data) {
    return (
      <div className="space-y-2 animate-pulse">
        <div className="h-3 w-24 bg-gold/10 rounded" />
        <div className="h-3 w-36 bg-gold/10 rounded" />
        <div className="h-3 w-28 bg-gold/10 rounded" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className={`${adminRaleway.className} text-[12px] text-[#C0392B]`}>{error}</p>
        <button
          onClick={fetchStatus}
          className={`${adminCinzel.className} text-[9px] tracking-[0.18em] text-gold hover:text-gold-hover transition-colors`}
        >
          RETRY
        </button>
      </div>
    )
  }

  if (!data) return null

  const pkg = data.shipment?.packages?.[0]

  return (
    <div className="space-y-4">

      {/* Status + refresh */}
      <div className="flex items-center justify-between gap-3">
        <StatusPill status={data.fulfillmentStatus} />
        <button
          onClick={fetchStatus}
          disabled={loading}
          title="Refresh from Gelato"
          className="flex items-center gap-1.5 text-text-muted hover:text-gold transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} strokeWidth={2} />
          <span className={`${adminRaleway.className} text-[11px] font-light`}>Refresh</span>
        </button>
      </div>

      {/* Details grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-3">
          <div>
            <p className={`${adminCinzel.className} text-[8px] tracking-[0.3em] text-text-muted`}>
              GELATO ORDER ID
            </p>
            <p className={`${adminRaleway.className} mt-0.5 text-[11px] font-light text-text-muted break-all`}>
              {gelatoOrderId}
            </p>
          </div>

          <div>
            <p className={`${adminCinzel.className} text-[8px] tracking-[0.3em] text-text-muted`}>
              FINANCIAL STATUS
            </p>
            <p className={`${adminRaleway.className} mt-0.5 text-[13px] font-light text-text-primary`}>
              {data.financialStatus.replace(/_/g, ' ')}
            </p>
          </div>

          <div>
            <p className={`${adminCinzel.className} text-[8px] tracking-[0.3em] text-text-muted`}>
              ORDERED AT
            </p>
            <p className={`${adminRaleway.className} mt-0.5 text-[13px] font-light text-text-primary`}>
              {new Date(data.orderedAt).toLocaleString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {data.shipment && (
            <>
              <div>
                <p className={`${adminCinzel.className} text-[8px] tracking-[0.3em] text-text-muted`}>
                  SHIPMENT METHOD
                </p>
                <p className={`${adminRaleway.className} mt-0.5 text-[13px] font-light text-text-primary`}>
                  {data.shipment.shipmentMethodName}
                </p>
              </div>

              <div>
                <p className={`${adminCinzel.className} text-[8px] tracking-[0.3em] text-text-muted`}>
                  ESTIMATED DELIVERY
                </p>
                <p className={`${adminRaleway.className} mt-0.5 text-[13px] font-light text-text-primary`}>
                  {new Date(data.shipment.minDeliveryDate).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short',
                  })}
                  {' — '}
                  {new Date(data.shipment.maxDeliveryDate).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </p>
              </div>
            </>
          )}

          {pkg && (
            <>
              <div>
                <p className={`${adminCinzel.className} text-[8px] tracking-[0.3em] text-text-muted`}>
                  TRACKING CODE
                </p>
                <p className={`${adminCinzel.className} mt-0.5 text-[13px] text-gold`}>
                  {pkg.trackingCode}
                </p>
              </div>

              {pkg.trackingUrl && (
                <a>
                  href={pkg.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${adminCinzel.className} inline-flex items-center gap-1.5 text-[9px] tracking-[0.18em] text-gold hover:text-gold-hover transition-colors`}
                  TRACK ON CARRIER
                  <ExternalLink className="h-3 w-3" strokeWidth={2} />
                </a>
              )}
            </>
          )}
        </div>
      </div>

      {/* Item statuses */}
      {data.items.length > 0 && (
        <div className="space-y-2 border-t border-gold/10 pt-3">
          <p className={`${adminCinzel.className} text-[8px] tracking-[0.28em] text-text-muted`}>
            ITEM STATUSES
          </p>
          <div className="space-y-1.5">
            {data.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <p className={`${adminRaleway.className} text-[11px] font-light text-text-muted truncate`}>
                  {item.productUid?.split('_gsi_')[1]?.split('_gco_')[0]?.toUpperCase() ?? item.id.slice(0, 8)}
                </p>
                <StatusPill status={item.fulfillmentStatus} />
              </div>
            ))}
          </div>
        </div>
      )}

      {lastFetched && (
        <p className={`${adminRaleway.className} text-right text-[10px] font-light text-text-muted`}>
          Updated {lastFetched.toLocaleTimeString('en-IN')}
        </p>
      )}
    </div>
  )
}