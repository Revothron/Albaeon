export function getUserCurrency(): 'INR' | 'USD' {
  if (typeof navigator === 'undefined') return 'INR'
  try {
    const formatter = new Intl.NumberFormat()
    return formatter.format(100000).includes('00,000') ? 'INR' : 'USD'
  } catch {
    return 'INR'
  }
}

export function formatPrice(priceINR: number, priceUSD: number | null, currency: 'INR' | 'USD'): string {
  if (currency === 'USD' && priceUSD !== null) {
    return `$${priceUSD.toFixed(2)}`
  }
  return `\u20B9${priceINR.toLocaleString('en-IN')}`
}
