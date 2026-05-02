import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = process.env.EMAIL_FROM ?? 'onboarding@resend.dev'
export const SUPPORT_EMAIL = process.env.EMAIL_SUPPORT ?? 'support@albaeon.com'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://albaeon.com'