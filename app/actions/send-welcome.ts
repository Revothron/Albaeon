'use server'

export async function sendWelcomeEmail(to: string, customerName: string): Promise<void> {
  const secret = process.env.INTERNAL_API_SECRET
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://albaeon.com'

  if (!secret) {
    console.error('[sendWelcomeEmail] INTERNAL_API_SECRET is not set — skipping welcome email')
    return
  }

  try {
    const response = await fetch(`${siteUrl}/api/auth/welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': secret,
      },
      body: JSON.stringify({ to, customerName }),
    })

    if (!response.ok) {
      console.error('[sendWelcomeEmail] Welcome email API returned', response.status)
    }
  } catch (err) {
    console.error('[sendWelcomeEmail] Failed to call welcome email route:', err)
  }
}
