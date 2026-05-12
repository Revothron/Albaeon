'use client'

import { useState, useEffect } from 'react'
import { getUserCurrency, formatPrice } from '@/lib/customer/currency'

export default function PriceDisplay({
  priceINR,
  priceUSD,
  className = '',
}: {
  priceINR: number
  priceUSD: number | null
  className?: string
}) {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR')

  useEffect(() => {
    const saved = localStorage.getItem('albaeon-currency') as 'INR' | 'USD' | null
    if (saved === 'INR' || saved === 'USD') {
      setCurrency(saved)
    } else {
      setCurrency(getUserCurrency())
    }
  }, [])

  return <span className={className}>{formatPrice(priceINR, priceUSD, currency)}</span>
}
