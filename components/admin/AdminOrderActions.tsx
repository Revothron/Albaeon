'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminCinzel, adminRaleway } from '@/components/admin/adminFonts'

type Props = {
  orderId: string
  currentStatus: string
  currentNotes: string
  currentTracking: {
    tracking_number: string
    courier: string
    courier_url: string
  }
}

export default function AdminOrderActions({
  orderId,
  currentStatus,
  currentNotes,
  currentTracking,
}: Props) {
  const router = useRouter()

  const [status, setStatus] = useState(currentStatus)
  const [trackingNumber, setTrackingNumber] = useState(currentTracking.tracking_number)
  const [courier, setCourier] = useState(currentTracking.courier)
  const [courierUrl, setCourierUrl] = useState(currentTracking.courier_url)
  const [notes, setNotes] = useState(currentNotes)

  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [savingTracking, setSavingTracking] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)
  const [error, setError] = useState('')

  async function callApi(body: object) {
    const res = await fetch('/api/admin/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.json()
  }

  async function handleStatusChange(newStatus: string) {
    setUpdatingStatus(true)
    setError('')
    const data = await callApi({ action: 'update_status', orderId, status: newStatus })
    if (data.error) { setError(data.error); setUpdatingStatus(false); return }
    setStatus(newStatus)
    setUpdatingStatus(false)
    router.refresh()
  }

  async function handleSaveTracking() {
    setSavingTracking(true)
    setError('')
    const data = await callApi({
      action: 'save_tracking',
      orderId,
      tracking_number: trackingNumber,
      courier,
      courier_url: courierUrl,
    })
    if (data.error) { setError(data.error); setSavingTracking(false); return }
    setSavingTracking(false)
    router.refresh()
  }

  async function handleSaveNotes() {
    setSavingNotes(true)
    setError('')
    const data = await callApi({ action: 'save_notes', orderId, notes })
    if (data.error) { setError(data.error); setSavingNotes(false); return }
    setSavingNotes(false)
    router.refresh()
  }

  const statusActions = [
    {
      label: 'MARK AS PROCESSING',
      value: 'processing',
      borderColor: '#E6A817',
      textColor: '#E6A817',
      activeBg: '#E6A817',
      activeText: '#130F18',
    },
    {
      label: 'MARK AS SHIPPED',
      value: 'shipped',
      borderColor: '#4A90C4',
      textColor: '#4A90C4',
      activeBg: '#4A90C4',
      activeText: '#130F18',
    },
    {
      label: 'MARK AS DELIVERED',
      value: 'delivered',
      borderColor: '#E6C979',
      textColor: '#E6C979',
      activeBg: '#E6C979',
      activeText: '#130F18',
    },
    {
      label: 'CANCEL ORDER',
      value: 'cancelled',
      borderColor: '#C0392B',
      textColor: '#C0392B',
      activeBg: '#C0392B',
      activeText: '#ffffff',
    },
  ]

  return (
    <>
      <section className="border border-gold/10 bg-[#1E1A2E] p-6">
        <p className={`${adminCinzel.className} text-[10px] font-bold tracking-[0.3em] text-gold`}>
          ORDER ACTIONS
        </p>

        {error && (
          <p className={`${adminRaleway.className} mt-2 text-[12px] text-[var(--status-error)]`}>
            {error}
          </p>
        )}

        <div className="mt-4 space-y-3">
          {/* {statusActions.map((action) => (
            <button
              key={action.value}
              type="button"
              disabled={updatingStatus || status === action.value}
              onClick={() => handleStatusChange(action.value)}
              className={`${adminCinzel.className} w-full border px-4 py-2 text-[10px] font-semibold tracking-[0.2em] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed`}
              style={{
                borderColor: action.border,
                color: status === action.value ? action.hoverColor : action.color,
                backgroundColor: status === action.value
                  ? action.hoverBg
                  : action.bg,
              }}
            >
              {status === action.value
                ? `✓ ${action.label.replace('MARK AS ', '')}`
                : updatingStatus ? '...' : action.label}
            </button>
          ))} */}
          {statusActions.map((action) => {
            const isActive = status === action.value
            return (
              <button
                key={action.value}
                type="button"
                disabled={updatingStatus || isActive}
                onClick={() => handleStatusChange(action.value)}
                className={`${adminCinzel.className} w-full border px-4 py-2 text-[10px] font-semibold tracking-[0.2em] transition-colors duration-200 disabled:cursor-not-allowed`}
                style={{
                  borderColor: action.borderColor,
                  color: isActive ? action.activeText : action.textColor,
                  backgroundColor: isActive ? action.activeBg : 'transparent',
                  opacity: updatingStatus && !isActive ? 0.4 : 1,
                }}
              >
                {isActive
                  ? `✓ ${action.label.replace('MARK AS ', '')}`
                  : updatingStatus ? '...' : action.label}
              </button>
            )
          })}
        </div>

        <div className="my-4 h-px w-full bg-gold/10" />

        <p className={`${adminCinzel.className} text-[9px] font-semibold tracking-[0.3em] text-text-muted`}>
          ADD TRACKING NUMBER
        </p>
        <div className="mt-3 space-y-3">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Tracking number"
            className={`${adminRaleway.className} h-[38px] w-full border border-gold/15 bg-footer px-3 text-[13px] font-light text-text-primary outline-none placeholder:text-text-muted`}
          />
          <input
            type="text"
            value={courier}
            onChange={(e) => setCourier(e.target.value)}
            placeholder="Courier name (Delhivery, FedEx...)"
            className={`${adminRaleway.className} h-[38px] w-full border border-gold/15 bg-footer px-3 text-[13px] font-light text-text-primary outline-none placeholder:text-text-muted`}
          />
          <input
            type="url"
            value={courierUrl}
            onChange={(e) => setCourierUrl(e.target.value)}
            placeholder="https://..."
            className={`${adminRaleway.className} h-[38px] w-full border border-gold/15 bg-footer px-3 text-[13px] font-light text-text-primary outline-none placeholder:text-text-muted`}
          />
          <button
            type="button"
            disabled={savingTracking}
            onClick={handleSaveTracking}
            className={`${adminCinzel.className} w-full bg-gold px-4 py-2 text-[10px] font-semibold tracking-[0.2em] text-nav hover:bg-gold-hover transition-colors disabled:opacity-50`}
          >
            {savingTracking ? 'SAVING...' : 'SAVE TRACKING'}
          </button>
        </div>
      </section>

      <section className="border border-gold/10 bg-[#1E1A2E] p-6">
        <p className={`${adminCinzel.className} text-[10px] font-bold tracking-[0.3em] text-gold`}>
          INTERNAL NOTES
        </p>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add internal notes..."
          className={`${adminRaleway.className} mt-3 w-full resize-none border border-gold/15 bg-footer px-3 py-2 text-[13px] font-light text-text-primary outline-none placeholder:text-text-muted`}
        />
        <button
          type="button"
          disabled={savingNotes}
          onClick={handleSaveNotes}
          className={`${adminCinzel.className} mt-3 w-full border border-gold/30 px-4 py-2 text-[10px] font-semibold tracking-[0.2em] text-text-muted transition-colors duration-200 hover:bg-gold hover:text-nav disabled:opacity-50`}
        >
          {savingNotes ? 'SAVING...' : 'SAVE NOTE'}
        </button>
      </section>
    </>
  )
}