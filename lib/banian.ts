export async function submitBanianOrder(order: {
  orderNumber: string
  customerName: string
  phone: string
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  items: {
    productName: string
    sku: string
    banianSku: string | null
    color: string
    size: string
    quantity: number
  }[]
}) {
  const formUrl = process.env.BANIAN_FORM_URL
  if (!formUrl) throw new Error('BANIAN_FORM_URL not configured')

  const results = []

  for (const item of order.items) {
    const body = new URLSearchParams({
      [process.env.BANIAN_FIELD_ORDER_NUMBER!]: order.orderNumber,
      [process.env.BANIAN_FIELD_NAME!]: order.customerName,
      [process.env.BANIAN_FIELD_PHONE!]: order.phone,
      [process.env.BANIAN_FIELD_ADDRESS!]: order.address.line1,
      [process.env.BANIAN_FIELD_CITY!]: order.address.city,
      [process.env.BANIAN_FIELD_STATE!]: order.address.state,
      [process.env.BANIAN_FIELD_PINCODE!]: order.address.postalCode,
      [process.env.BANIAN_FIELD_PRODUCT_SKU!]: item.banianSku ?? item.sku,
      [process.env.BANIAN_FIELD_COLOR!]: item.color,
      [process.env.BANIAN_FIELD_SIZE!]: item.size,
      [process.env.BANIAN_FIELD_QUANTITY!]: String(item.quantity),
    })

    let attempt = 0
    let success = false

    while (attempt < 3 && !success) {
      try {
        const res = await fetch(formUrl, { method: 'POST', body })
        if (res.ok || res.status === 200) {
          success = true
          results.push({ item: item.sku, success: true, status: res.status })
        } else {
          attempt++
          await new Promise((r) => setTimeout(r, 5000))
        }
      } catch {
        attempt++
        await new Promise((r) => setTimeout(r, 5000))
      }
    }

    if (!success) {
      results.push({ item: item.sku, success: false, error: 'Failed after 3 attempts' })
    }
  }

  return results
}