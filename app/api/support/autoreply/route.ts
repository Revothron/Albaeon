import { NextResponse } from 'next/server'
import { sendSupportAutoReply } from '@/lib/emails'

export async function POST(req: Request) {
  try {
    const { to, customerName, subject, ticketId } = await req.json()
    await sendSupportAutoReply({ to, customerName, subject, ticketId })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Auto-reply error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}