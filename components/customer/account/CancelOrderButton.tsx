'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Cinzel } from 'next/font/google'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['600', '700'] })

export default function CancelOrderButton({
  orderNumber,
  totalAmount,
}: {
  orderNumber: string
  totalAmount: number
}) {
  const [step, setStep] = useState<'idle' | 'confirm' | 'cancelling' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [refundStatus, setRefundStatus] = useState('')
  const router = useRouter()

  async function handleCancel() {
    setStep('cancelling')

    const res = await fetch('/api/orders/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderNumber }),
    })

    const data = await res.json()

    if (!res.ok || data.error) {
      setMessage(data.error ?? 'Failed to cancel. Please contact support.')
      setStep('error')
      return
    }

    setMessage(data.message)
    setRefundStatus(data.refundStatus ?? '')
    setStep('done')
    setTimeout(() => router.refresh(), 1000)
  }

  if (step === 'done') {
    return (
      <div className="space-y-3">
        <div className="border-l-2 border-[#C0392B] bg-[#C0392B0F] px-4 py-4">
          <p className={`${cinzel.className} text-[10px] tracking-[0.2em] text-[#C0392B] mb-1`}>
            ORDER CANCELLED
          </p>
          <p className="font-sans text-[13px] leading-[1.7] text-text-primary">{message}</p>
        </div>
        {refundStatus && (
          <div className="border-l-2 border-[#4A90C4] bg-[#4A90C40F] px-4 py-3">
            <p className={`${cinzel.className} text-[10px] tracking-[0.2em] text-[#4A90C4] mb-1`}>
              REFUND STATUS
            </p>
            <p className="font-sans text-[13px] text-text-muted">
              {refundStatus === 'refunded'
                ? '✓ Refund processed successfully'
                : refundStatus === 'refund_pending'
                ? 'Refund initiated — 5 to 7 business days'
                : refundStatus === 'refund_failed'
                ? 'Refund initiation failed — our team will process it manually within 48 hours'
                : ''}
            </p>
          </div>
        )}
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="space-y-3">
        <div className="border-l-2 border-[#C0392B] bg-[#C0392B0F] px-4 py-3">
          <p className="font-sans text-[13px] text-[#C0392B]">{message}</p>
        </div>
        <button
          type="button"
          onClick={() => setStep('idle')}
          className="font-sans text-[13px] text-gold hover:text-gold-hover transition-colors"
        >
          Try again
        </button>
      </div>
    )
  }

  if (step === 'confirm') {
    return (
      <div className="space-y-3">
        <div className="border border-[#C0392B]/30 bg-[#C0392B08] p-4 space-y-2">
          <p className={`${cinzel.className} text-[10px] tracking-[0.2em] text-[#C0392B]`}>
            CONFIRM CANCELLATION
          </p>
          <p className="font-sans text-[13px] leading-[1.7] text-text-muted">
            This will cancel your order and initiate a full refund of{' '}
            <span className="text-text-primary font-semibold">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>{' '}
            to your original payment method. Refunds take 5-7 business days.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStep('idle')}
            className="flex-1 border border-gold/20 px-4 py-2.5 font-sans text-[13px] text-text-muted hover:text-gold transition-colors"
          >
            Keep Order
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 border border-[#C0392B] bg-[#C0392B] px-4 py-2.5 font-sans text-[13px] font-semibold text-white hover:bg-[#a93226] transition-colors"
          >
            Yes, Cancel & Refund
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setStep('confirm')}
      disabled={step === 'cancelling'}
      className="w-full border border-[#C0392B] px-4 py-3 font-sans text-[13px] font-semibold text-[#C0392B] transition-colors duration-200 hover:bg-[#C0392B] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {step === 'cancelling' ? 'Cancelling...' : 'Cancel Order & Request Refund'}
    </button>
  )
}