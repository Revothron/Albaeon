import { resend, FROM_EMAIL, SITE_URL } from '@/lib/resend'
import { render } from '@react-email/components'
import OrderConfirmation from '@/emails/OrderConfirmation'
import OrderShipped from '@/emails/OrderShipped'
import SupportAutoReply from '@/emails/SupportAutoReply'
import SupportReply from '@/emails/SupportReply'

// ── Order confirmation ────────────────────────────────
export async function sendOrderConfirmation({
  to,
  customerName,
  orderNumber,
  orderDate,
  items,
  subtotal,
  shipping,
  total,
  shippingAddress,
}: {
  to: string
  customerName: string
  orderNumber: string
  orderDate: string
  items: { name: string; color: string; size: string; quantity: number; price: string; subtotal: string }[]
  subtotal: string
  shipping: string
  total: string
  shippingAddress: { line1: string; line2?: string; city: string; state: string; postal: string; country: string }
}) {
  const html = await render(OrderConfirmation({
    customerName,
    orderNumber,
    orderDate,
    items,
    subtotal,
    shipping,
    total,
    shippingAddress,
    trackOrderUrl: `${SITE_URL}/track-order`,
  }))

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Your Albaeon Order ${orderNumber} is Confirmed`,
    html,
  })
}

// ── Order shipped ─────────────────────────────────────
export async function sendOrderShipped({
  to,
  customerName,
  orderNumber,
  trackingNumber,
  courier,
  courierUrl,
  estimatedDelivery,
}: {
  to: string
  customerName: string
  orderNumber: string
  trackingNumber: string
  courier: string
  courierUrl: string
  estimatedDelivery?: string
}) {
  const html = await render(OrderShipped({
    customerName,
    orderNumber,
    trackingNumber,
    courier,
    courierUrl,
    estimatedDelivery,
  }))

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Your order ${orderNumber} is on its way!`,
    html,
  })
}

// ── Support auto-reply ────────────────────────────────
export async function sendSupportAutoReply({
  to,
  customerName,
  subject,
  ticketId,
}: {
  to: string
  customerName: string
  subject: string
  ticketId: string
}) {
  const html = await render(SupportAutoReply({ customerName, subject, ticketId }))

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `We received your message — Albaeon Support`,
    html,
  })
}

// ── Support reply ─────────────────────────────────────
export async function sendSupportReply({
  to,
  customerName,
  replyMessage,
  originalSubject,
}: {
  to: string
  customerName: string
  replyMessage: string
  originalSubject: string
}) {
  const html = await render(SupportReply({ customerName, replyMessage, originalSubject }))

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Reply from Albaeon Support`,
    html,
  })
}