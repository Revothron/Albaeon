import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { sendSupportReply } from '@/lib/emails'
import { supportRatelimit, getClientIp } from '@/lib/ratelimit'
import { requireAdmin } from '@/lib/auth/require-admin'

const SupportReplySchema = z.object({
  to: z.string().email(),
  customerName: z.string().min(1).max(100),
  replyMessage: z.string().min(1).max(5000),
  originalSubject: z.string().min(1).max(200),
})

export async function POST(req: Request) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const ip = getClientIp(req)
    const { success } = await supportRatelimit.limit(ip)
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
    }

    const parsed = SupportReplySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed.', issues: parsed.error.issues },
        { status: 422 }
      )
    }

    const { to, customerName, replyMessage, originalSubject } = parsed.data
    await sendSupportReply({ to, customerName, replyMessage, originalSubject })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Reply email error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
