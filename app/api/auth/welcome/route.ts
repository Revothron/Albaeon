import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/emails'

export async function POST(req: Request) {
  const internalSecret = req.headers.get('x-internal-secret')
  if (
    !process.env.INTERNAL_API_SECRET ||
    internalSecret !== process.env.INTERNAL_API_SECRET
  ) {
    return NextResponse.json(
      { error: 'Forbidden.' },
      { status: 403 }
    )
  }

  try {
    const { to, customerName } = await req.json()
    await sendWelcomeEmail({ to, customerName })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Welcome email error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}