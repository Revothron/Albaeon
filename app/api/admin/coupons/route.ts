import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCoupon, updateCoupon, deleteCoupon } from '@/lib/admin/coupons'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  return profile?.role === 'admin' ? user : null
}

export async function POST(req: Request) {
  const user = await checkAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { action } = body

  if (action === 'create') {
    const result = await createCoupon(body.fields)
    return NextResponse.json(result)
  }

  if (action === 'update') {
    const result = await updateCoupon(body.id, body.fields)
    return NextResponse.json(result)
  }

  if (action === 'delete') {
    const result = await deleteCoupon(body.id)
    return NextResponse.json(result)
  }

  if (action === 'toggle') {
    const result = await updateCoupon(body.id, { is_active: body.is_active })
    return NextResponse.json(result)
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}