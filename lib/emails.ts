import { resend, FROM_EMAIL, SITE_URL } from '@/lib/resend'
import { render } from '@react-email/components'
import OrderConfirmation from '@/emails/OrderConfirmation'
import OrderShipped from '@/emails/OrderShipped'
import SupportAutoReply from '@/emails/SupportAutoReply'
import SupportReply from '@/emails/SupportReply'
import Welcome from '@/emails/Welcome'
import NewProduct from '@/emails/NewProduct'

import PasswordReset from '@/emails/PasswordReset'
import EmailVerify from '@/emails/EmailVerify'
import OrderDelivered from '@/emails/OrderDelivered'

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

// Welcome email
export async function sendWelcomeEmail({
  to,
  customerName,
}: {
  to: string
  customerName: string
}) {
  const html = await render(Welcome({ customerName }))

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Welcome to Albaeon`,
    html,
  })
}

// New product notification
export async function sendNewProductNotification({
  recipients,
  productName,
  productDescription,
  productPrice,
  productImage,
  productSlug,
}: {
  recipients: string[]
  productName: string
  productDescription: string
  productPrice: string
  productImage: string
  productSlug: string
}) {
  const html = await render(NewProduct({
    productName,
    productDescription,
    productPrice,
    productImage,
    productUrl: `${SITE_URL}/shop/product/${productSlug}`,
  }))

  return resend.emails.send({
    from: FROM_EMAIL,
    to: recipients,
    subject: `New arrival: ${productName}`,
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

// ── Password reset ────────────────────────────────────
export async function sendPasswordReset({
  to,
  customerName,
  resetUrl,
}: {
  to: string
  customerName: string
  resetUrl: string
}) {
  const html = await render(PasswordReset({
    customerName,
    resetUrl,
    expiresIn: '15 minutes',
  }))

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Reset your Albaeon password',
    html,
  })
}

// ── Email verification ────────────────────────────────
export async function sendEmailVerification({
  to,
  customerName,
  verifyUrl,
}: {
  to: string
  customerName: string
  verifyUrl: string
}) {
  const html = await render(EmailVerify({
    customerName,
    verifyUrl,
  }))

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Verify your Albaeon email address',
    html,
  })
}

// ── Order delivered ───────────────────────────────────
export async function sendOrderDelivered({
  to,
  customerName,
  orderNumber,
  items,
}: {
  to: string
  customerName: string
  orderNumber: string
  items: { name: string; color: string; size: string; quantity: number }[]
}) {
  const html = await render(OrderDelivered({
    customerName,
    orderNumber,
    items,
    reviewUrl: `${SITE_URL}/account/orders`,
    supportUrl: `${SITE_URL}/contact`,
    invoiceUrl: `${SITE_URL}/account/orders`,
  }))

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Your Albaeon order ${orderNumber} has been delivered`,
    html,
  })
}