import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendSupportReply } from '@/lib/emails'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { to, customerName, replyMessage, originalSubject } = await req.json()
    await sendSupportReply({ to, customerName, replyMessage, originalSubject })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Reply email error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}