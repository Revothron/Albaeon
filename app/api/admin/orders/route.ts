import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  updateOrderStatus,
  saveOrderTracking,
  saveOrderNotes,
} from '@/lib/admin/orders'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

export async function POST(req: Request) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { action, orderId } = body

  if (action === 'update_status') {
    const result = await updateOrderStatus(orderId, body.status)
    return NextResponse.json(result)
  }

  if (action === 'save_tracking') {
    const result = await saveOrderTracking(orderId, {
      tracking_number: body.tracking_number,
      courier: body.courier,
      courier_url: body.courier_url,
    })
    return NextResponse.json(result)
  }

  if (action === 'save_notes') {
    const result = await saveOrderNotes(orderId, body.notes)
    return NextResponse.json(result)
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}