import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendSupportAutoReply } from '@/lib/emails'
import { supportRatelimit, getClientIp } from '@/lib/ratelimit'

const SupportAutoReplySchema = z.object({
  to: z.string().email(),
  customerName: z.string().min(1).max(100),
  subject: z.string().min(1).max(200),
  ticketId: z.string().uuid(),
})

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const { success } = await supportRatelimit.limit(ip)
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429 }
      )
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
    }

    const parsed = SupportAutoReplySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed.', issues: parsed.error.issues },
        { status: 422 }
      )
    }

    const { to, customerName, subject, ticketId } = parsed.data
    await sendSupportAutoReply({ to, customerName, subject, ticketId })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Auto-reply error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
