const GELATO_ORDER_URL = 'https://order.gelatoapis.com'

function headers() {
  return {
    'X-API-KEY': process.env.GELATO_API_KEY!,
    'Content-Type': 'application/json',
  }
}

// ── Fetch template variants from Gelato ───────────────
export async function getGelatoTemplateVariants(templateId: string) {
  const storeId = process.env.GELATO_STORE_ID
  if (!storeId) throw new Error('GELATO_STORE_ID not configured')

  const res = await fetch(
    `https://ecommerce.gelatoapis.com/v1/stores/${storeId}/products/${templateId}`,
    { headers: headers() }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message ?? 'Failed to fetch template')

    console.log("Gelato variants:", data?.variants)

  // Returns variants with templateVariantId + title like "Black - S"
  return data?.variants ?? []
}

// ── Create order using template variant IDs ───────────
export async function createGelatoOrder(params: {
  orderReferenceId: string
  customerReferenceId: string
  currency: string
  items: {
    itemReferenceId: string
    templateVariantId: string
    quantity: number
  }[]
  shippingAddress: {
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state?: string
    postCode: string
    country: string
    email: string
    phone?: string
  }
}) {
  const res = await fetch(`${GELATO_ORDER_URL}/v4/orders`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      orderType: 'order',
      orderReferenceId: params.orderReferenceId,
      customerReferenceId: params.customerReferenceId,
      currency: params.currency,
      items: params.items,
      shipmentMethodUid: 'standard',
      shippingAddress: params.shippingAddress,
      returnAddress: { companyName: 'Albaeon' },
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('Gelato createOrder failed:', JSON.stringify(data))
    throw new Error(data?.message ?? `Gelato API error ${res.status}`)
  }
  return data
}

// ── Cancel order ──────────────────────────────────────
export async function cancelGelatoOrder(gelatoOrderId: string) {
  const res = await fetch(
    `${GELATO_ORDER_URL}/v4/orders/${gelatoOrderId}:cancel`,
    { method: 'POST', headers: headers() }
  )
  if (res.status === 409) throw new Error('Order already in production')
  if (res.status === 404) throw new Error('Gelato order not found')
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.message ?? 'Failed to cancel')
  }
  return { cancelled: true }
}